# NaBotCity Desktop Window
## Compile and run
- To run
    - `npm install electron --save-dev`
    - `npm start`
- To build
    - `npm install --save-dev electron-builder`
    - `npm run build`

## Linux
- For direct execution
    - Make script executable
        - `chmod +x linux.sh`
    - Run it
        - `./linux.sh`
- For key binding
    - Add custom keyboard shortcut for example (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd>) in Ubuntu Settings → Keyboard.
    - Command should be something like `bash -c "cd /NaBotCity/Desktop && npm start"`