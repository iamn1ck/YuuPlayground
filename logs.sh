# write console logs to file
adb logcat --pid=$(adb shell pidof com.example.yuuonline) > asd.out