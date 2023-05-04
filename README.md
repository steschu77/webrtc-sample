# WebRTC Simplest Example

Simple WebRTC example for experiments

## How to Use

1. Create HTTPS certificates using `gen-cert.sh`
2. Start the signaling server with `yarn run start`
3. Open https://host:3000/sender.html in a browser A.
4. Open https://host:3000/receiver.html in a browser B

After that you should see the shared screen in Browser B.

Make sure that both browsers can talk to each other directly.
