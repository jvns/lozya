﻿import { injectNewDOMMethods } from "./protos.js";

export class AppGui {
    constructor(game) {
        injectNewDOMMethods();
        this.game = game;
        this.menu = document.querySelector("#menu");
        this.menuControl = document.querySelector("#menuControl");
        this.jitsiContainer = document.querySelector("#jitsi");
        this.menuControl.addEventListener("click", this.shrink.bind(this));
        this.demoVideo = document.querySelector("#demo > video");
        this.loginView = document.querySelector("#loginView");
        this.roomNameInput = document.querySelector("#room");
        this.userNameInput = document.querySelector("#user");
        this.connectButton = document.querySelector("#connect");

        this.roomNameInput.addEventListener("enter", this.userNameInput.focus.bind(this.userNameInput));


        this.userNameInput.addEventListener("enter", this.login.bind(this));
        this.connectButton.addEventListener("click", this.login.bind(this));

        this.showLogin();

        if (location.hash.length > 0) {
            this.roomNameInput.value = location.hash.substr(1);
            this.userNameInput.focus();
        }
        else {
            this.roomNameInput.focus();
        }
    }

    shrink() {
        const isOpen = this.menu.className === "menu-open",
            ui = !!this.game.me ? this.game.frontBuffer : this.loginView

        this.menu.className = isOpen ? "menu-closed" : "menu-open";;

        if (isOpen) {
            ui.hide();
        }
        else {
            ui.show();
        }
    }

    showLogin() {
        this.connectButton.innerHTML = "Connect";
        this.connectButton.unlock();
        this.roomNameInput.unlock();
        this.userNameInput.unlock();

        this.jitsiContainer.hide();
        this.game.frontBuffer.hide();
        this.demoVideo.parentElement.show();
        this.demoVideo.show();
        this.demoVideo.play();
        this.loginView.show();
    }

    login() {
        this.connectButton.innerHTML = "Connecting...";
        this.connectButton.lock();
        this.roomNameInput.lock();
        this.userNameInput.lock();
        const roomName = this.roomNameInput.value.trim(),
            userName = this.userNameInput.value.trim();

        if (roomName.length > 0
            && userName.length > 0) {
            this.startConference(roomName, userName);
        }
        else {
            this.showLogin();

            if (roomName.length === 0) {
                this.roomNameInput.value = "";
                this.roomNameInput.focus();
            }
            else if (userName.length === 0) {
                this.userNameInput.value = "";
                this.userNameInput.focus();
            }
        }
    }

    startConference(roomName, userName) {
        this.jitsiContainer.show();

        location.hash = roomName;

        const api = new JitsiMeetExternalAPI(JITSI_HOST, {
            noSSL: false,
            disableThirdPartyRequests: true,
            parentNode: this.jitsiContainer,
            width: "100%",
            height: "100%",
            configOverwrite: {
                startAudioOnly: true
            },
            interfaceConfigOverwrite: {
                DISABLE_VIDEO_BACKGROUND: true
            },
            roomName: roomName,
            onload: (evt) => {
                this.game.jitsiClient.setJitsiApi(api);
            }
        });
        api.executeCommand("displayName", userName);
        this.game.registerGameListeners(api);
        api.addEventListener("videoConferenceJoined", (evt) => {
            this.loginView.hide();
            this.demoVideo.pause();
            this.demoVideo.hide();
            this.demoVideo.parentElement.hide();
        });

        addEventListener("unload", () => api.dispose());
    }
}