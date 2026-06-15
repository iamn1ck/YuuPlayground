import bpy
import json

# ------------------------------------------------------------
# SAFE CONVERSION SYSTEM
# ------------------------------------------------------------

def make_json_safe(value):
    """Convert any Blender/RNA type into JSON-serializable format."""

    # Vectors / colors / arrays
    if hasattr(value, "__len__") and not isinstance(value, (str, bytes)):
        try:
            return [make_json_safe(v) for v in value]
        except Exception:
            return str(value)

    # basic types
    if isinstance(value, (int, float, str, bool)) or value is None:
        return value

    # fallback
    return str(value)


# ------------------------------------------------------------
# GET ACTIVE OBJECT SAFELY
# ------------------------------------------------------------

def get_active_object():
    obj = bpy.context.view_layer.objects.active or bpy.context.active_object
    if obj is None:
        raise Exception("No active object selected")
    return obj


# ------------------------------------------------------------
# MATERIAL VALIDATION
# ------------------------------------------------------------

def get_node_material(obj):
    mat = obj.active_material
    if mat is None:
        raise Exception(f"Object '{obj.name}' has no active material")

    if not mat.use_nodes:
        raise Exception(f"Material '{mat.name}' does not use nodes")

    return mat


# ------------------------------------------------------------
# NODE EXPORT
# ------------------------------------------------------------

def export_node(node):
    node_data = {
        "name": node.name,
        "label": node.label,
        "type": node.bl_idname,
        "location": make_json_safe(node.location),
        "properties": {},
        "inputs": {},
        "outputs": {}
    }

    # ----------------------------------------
    # Common known attributes
    # ----------------------------------------
    known_attrs = [
        "operation",
        "blend_type",
        "data_type",
        "interpolation_type",
        "clamp",
        "use_clamp",
        "distribution",
        "noise_dimensions",
        "musgrave_dimensions",
        "gradient_type",
        "wave_type",
        "wave_profile",
        "mapping",
        "vector_type"
    ]

    for attr in known_attrs:
        if hasattr(node, attr):
            try:
                node_data["properties"][attr] = make_json_safe(getattr(node, attr))
            except:
                pass

    # ----------------------------------------
    # Full RNA property dump (safe)
    # ----------------------------------------
    try:
        for prop in node.bl_rna.properties:
            name = prop.identifier

            if name in {
                "rna_type", "name", "label",
                "location", "width", "height", "select"
            }:
                continue

            try:
                value = getattr(node, name)
                node_data["properties"][name] = make_json_safe(value)
            except:
                pass
    except:
        pass

    # ----------------------------------------
    # Inputs
    # ----------------------------------------
    for socket in node.inputs:
        try:
            node_data["inputs"][socket.name] = {
                "default_value": make_json_safe(socket.default_value) if hasattr(socket, "default_value") else None,
                "type": socket.type
            }
        except:
            pass

    # ----------------------------------------
    # Outputs
    # ----------------------------------------
    for socket in node.outputs:
        try:
            node_data["outputs"][socket.name] = {
                "type": socket.type
            }
        except:
            pass

    return node_data


# ------------------------------------------------------------
# MAIN EXPORT FUNCTION
# ------------------------------------------------------------

def export_shader_graph():
    obj = get_active_object()
    mat = get_node_material(obj)
    tree = mat.node_tree

    data = {
        "material": mat.name,
        "object": obj.name,
        "nodes": [],
        "links": []
    }

    # Export nodes
    for node in tree.nodes:
        data["nodes"].append(export_node(node))

    # Export links
    for link in tree.links:
        data["links"].append({
            "from_node": link.from_node.name,
            "from_socket": link.from_socket.name,
            "from_socket_index": link.from_socket.identifier,
            "to_node": link.to_node.name,
            "to_socket": link.to_socket.name,
            "to_socket_index": link.to_socket.identifier
        })

    # Save next to blend file
    path = bpy.path.abspath("/tmp/shader_graph_export.json")

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print("Shader graph exported:", path)


# ------------------------------------------------------------
# RUN
# ------------------------------------------------------------

export_shader_graph()