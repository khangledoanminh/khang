// ==UserScript==
// @name         EvoKID (No-Key)
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  MOD EVOWARS.IO VIP BY NLHH - PRO COMBAT AI (NO KEY)
// @author       #NLHH
// @match        https://evowars.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evowars.io
// @run-at       document-idle
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    let isAuthenticated = true;
    const WEAPON_STATS = {
            0: { distance: 200, degrees: 125 },
            2: { distance: 235, degrees: 90 },
            3: { distance: 245, degrees: 125 },
            4: { distance: 260, degrees: 125 },
            5: { distance: 300, degrees: 133 },
            6: { distance: 340, degrees: 125 },
            7: { distance: 380, degrees: 131 },
            8: { distance: 343, degrees: 130 },
            9: { distance: 350, degrees: 125 },
            10: { distance: 470, degrees: 133 },
            11: { distance: 510, degrees: 129 },
            12: { distance: 520, degrees: 133 },
            13: { distance: 555, degrees: 134 },
            14: { distance: 595, degrees: 125 },
            15: { distance: 650, degrees: 129 },
            16: { distance: 655, degrees: 131 },
            17: { distance: 660, degrees: 125 },
            18: { distance: 695, degrees: 125 },
            19: { distance: 690, degrees: 125 },
            20: { distance: 710, degrees: 130 },
            21: { distance: 775, degrees: 130 },
            22: { distance: 805, degrees: 136 },
            23: { distance: 680, degrees: 122 },
            24: { distance: 870, degrees: 125 },
            25: { distance: 940, degrees: 137 },
            26: { distance: 975, degrees: 130 },
            27: { distance: 1050, degrees: 125 },
            28: { distance: 1095, degrees: 125 },
            29: { distance: 1000, degrees: 135 },
            30: { distance: 995, degrees: 125 },
            31: { distance: 1050, degrees: 130 },
            32: { distance: 1145, degrees: 134 },
            33: { distance: 1120, degrees: 139 },
            34: { distance: 1125, degrees: 124 },
            35: { distance: 1145, degrees: 135 },
            36: { distance: 1250, degrees: 122 },
            37: { distance: 1300, degrees: 125 },
            38: { distance: 1300, degrees: 125 },
            39: { distance: 1300, degrees: 125 }
        },
        getWeaponStats = level => WEAPON_STATS[level] || {
            distance: Math.max(200, level * 30),
            degrees: 125
        },
        ARC_MULTIPLIERS = {
            1: 0.6, 2: 0.75, 3: 0.7, 4: 0.75, 5: 0.8, 6: 0.75, 7: 0.76, 8: 0.75, 9: 0.9, 10: 0.95,
            11: 0.8, 12: 0.75, 13: 0.75, 14: 0.8, 15: 0.8, 16: 0.7, 17: 0.75, 18: 0.8, 19: 0.8, 20: 0.85,
            21: 0.85, 22: 0.81, 23: 0.82, 24: 1.05, 25: 0.85, 26: 0.8, 27: 0.85, 28: 0.78, 29: 0.7, 30: 0.8,
            31: 0.85, 32: 0.85, 33: 0.8, 34: 0.8, 35: 0.83, 36: 0.9, 37: 0.85, 38: 0.9, 39: 0.95, 40: 0.91, 41: 1.06
        },
        getArcMultiplier = (level, defaultMul) => ARC_MULTIPLIERS[Math.floor(level) + 1] || defaultMul;

    window.ultimate_ghostAngle = null;
    window.ultimate_angleLockTime = 0;

    // Enhanced visual config
    const VISUAL_THEME = {
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        accent: '#06b6d4',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
        bg: 'rgba(15, 12, 30, 0.95)',
        border: '#4c1d95',
        text: '#e2e8f0',
        textDim: '#94a3b8'
    };

    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

        * { box-sizing: border-box; }

        #evo-lock-screen {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: linear-gradient(135deg, #0f0c20 0%, #15102a 50%, #060409 100%);
            z-index: 2147483646; display: flex; align-items: center; justify-content: center; pointer-events: all;
        }
        #evo-key-panel {
            width: 420px; background: rgba(12, 10, 18, 0.96); border: 2px solid #7c3aed;
            border-radius: 20px; font-family: 'Oxanium', sans-serif; padding: 30px;
            box-shadow: 0 0 60px rgba(124, 58, 237, 0.4), 0 0 120px rgba(124, 58, 237, 0.2);
            color: #fff; text-align: center; z-index: 2147483647;
        }
        #evo-key-input {
            width: 100%; padding: 14px; margin: 20px 0; background: #161421; border: 1px solid #4a2080;
            border-radius: 10px; color: #fff; font-size: 15px; text-align: center; outline: none;
            box-sizing: border-box; font-weight: 600; letter-spacing: 0.5px;
            transition: all 0.3s ease;
        }
        #evo-key-input:focus {
            border-color: #7c3aed; box-shadow: 0 0 20px rgba(124,58,237,0.5); transform: scale(1.02);
        }
        .evo-key-btn {
            width: 48%; padding: 12px; border-radius: 10px; font-weight: bold; font-size: 13px;
            cursor: pointer; border: none; margin: 5px 1%; transition: all 0.25s ease; font-family: 'Oxanium', sans-serif;
        }
        #evo-btn-submit { background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white; }
        #evo-btn-submit:hover { background: linear-gradient(135deg, #6d28d9, #5b21b6); box-shadow: 0 0 20px rgba(124,58,237,0.6); transform: translateY(-2px); }
        #evo-btn-getkey { background: #221f36; color: #a78bfa; border: 1px solid #4a2080; }
        #evo-btn-getkey:hover { background: #2d294a; transform: translateY(-2px); }
        #evo-btn-tele {
            background: linear-gradient(135deg, #0891b2, #0e7490); color: white;
            box-shadow: 0 4px 20px rgba(8, 145, 178, 0.4); width: 100%; margin: 0; transition: all 0.3s ease;
        }
        #evo-btn-tele:hover { background: linear-gradient(135deg, #0e7490, #155e75); box-shadow: 0 0 30px rgba(8, 145, 178, 0.6); transform: scale(1.02); }
        #evo-key-msg { font-size: 13px; margin-top: 15px; font-weight: 600; min-height: 20px; line-height: 1.4; }

        #evo-toggle-btn {
            position: fixed; bottom: 20px; left: 20px; width: 50px; height: 50px;
            display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(109, 40, 217, 0.9));
            backdrop-filter: blur(10px); color: #fff; border-radius: 50%; cursor: pointer;
            z-index: 99999; font-size: 22px; border: 2px solid rgba(167, 139, 250, 0.5);
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.5), 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0.7; display: none;
        }
        #evo-toggle-btn:hover {
            transform: scale(1.15) rotate(10deg); opacity: 1;
            box-shadow: 0 0 35px rgba(139, 92, 246, 0.8), 0 6px 20px rgba(0,0,0,0.4);
            border-color: rgba(167, 139, 250, 0.8);
        }
        #evo-toggle-btn:active {
            transform: scale(0.95);
        }

        #evo-menu {
            position: fixed; top: 50px; left: 50px; width: 720px; height: 520px;
            background: linear-gradient(180deg, rgba(20, 15, 35, 0.98), rgba(12, 10, 18, 0.98));
            backdrop-filter: blur(16px) saturate(180%); border-radius: 16px;
            font-family: 'Oxanium', sans-serif; color: #aaa; z-index: 99998;
            box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(139, 92, 246, 0.15);
            border: 1px solid rgba(139, 92, 246, 0.3);
            display: flex; flex-direction: column; resize: both; overflow: auto;
            min-width: 600px; min-height: 400px; display: none;
            animation: menuSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes menuSlideIn {
            from { opacity: 0; transform: translateY(-20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        #evo-menu::-webkit-scrollbar { width: 8px; height: 8px; }
        #evo-menu::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #7c3aed, #6d28d9); border-radius: 4px;
        }
        #evo-menu::-webkit-scrollbar-track { background: rgba(30, 30, 50, 0.5); border-radius: 4px; }

        #evo-header {
            height: 56px; min-height: 56px; padding: 0 24px; font-size: 16px; font-weight: 700;
            color: #fff; border-bottom: 1px solid rgba(139, 92, 246, 0.3); cursor: grab;
            display: flex; align-items: center; justify-content: space-between;
            background: linear-gradient(90deg, rgba(30, 15, 50, 0.8), rgba(20, 12, 35, 0.8));
            position: sticky; top: 0; z-index: 2; user-select: none;
            border-radius: 16px 16px 0 0;
        }
        #evo-header:active { cursor: grabbing; }
        #evo-close {
            cursor: pointer; font-size: 24px; color: #aaa; transition: all 0.2s ease;
            width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
            border-radius: 8px;
        }
        #evo-close:hover { color: #ef4444; background: rgba(239, 68, 68, 0.15); transform: rotate(90deg); }

        .evo-body {
            display: flex; padding: 20px; gap: 20px; flex-wrap: wrap;
            animation: fadeIn 0.5s ease 0.2s both;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .evo-col {
            flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 16px;
        }

        .section-title {
            font-size: 10px; font-weight: 800; letter-spacing: 2px;
            color: #a78bfa; margin-bottom: 8px; text-transform: uppercase;
            display: flex; align-items: center; gap: 8px;
        }
        .section-title::before {
            content: ''; width: 4px; height: 16px; background: linear-gradient(180deg, #7c3aed, #a78bfa);
            border-radius: 2px;
        }

        .section {
            background: linear-gradient(135deg, rgba(30, 25, 50, 0.6), rgba(25, 20, 40, 0.6));
            border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 14px;
            border: 1px solid rgba(74, 32, 128, 0.4);
            transition: all 0.3s ease;
        }
        .section:hover {
            border-color: rgba(139, 92, 246, 0.4);
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.1);
        }

        .row {
            display: flex; justify-content: space-between; align-items: center;
            font-size: 13px; color: #e2e8f0; font-weight: 500;
            padding: 4px 0;
        }

        .switch {
            position: relative; width: 42px; height: 24px; flex-shrink: 0;
        }
        .switch input { opacity: 0; width: 0; height: 0; }

        .slider {
            position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
            background: #2d2d3d; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 24px;
        }
        .slider:before {
            position: absolute; content: ""; height: 18px; width: 18px; left: 3px;
            bottom: 3px; background: #fff; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        input:checked + .slider {
            background: linear-gradient(135deg, #7c3aed, #6d28d9);
            box-shadow: 0 0 15px rgba(124,58,237,0.6);
        }
        input:checked + .slider:before { transform: translateX(18px); }

        .range-wrap {
            display: flex; align-items: center; gap: 12px; width: 60%;
        }
        input[type=range] {
            -webkit-appearance: none; width: 100%; height: 6px;
            background: linear-gradient(90deg, #2d2d3d, #4a2080); border-radius: 3px; outline: none;
        }
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%;
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            cursor: pointer; box-shadow: 0 0 10px rgba(139, 92, 246, 0.8);
            transition: all 0.2s ease;
        }
        input[type=range]::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 0 20px rgba(139, 92, 246, 1);
        }

        .val-disp {
            color: #a78bfa; font-size: 13px; font-weight: bold; min-width: 45px;
            text-align: right; font-family: 'JetBrains Mono', monospace;
            background: rgba(139, 92, 246, 0.15); padding: 4px 8px; border-radius: 6px;
        }

        #evo-expire-warning {
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(135deg, rgba(225, 29, 72, 0.95), rgba(185, 28, 28, 0.95));
            border: 2px solid #fda4af; color: #fff; padding: 12px 25px; border-radius: 12px;
            font-family: 'Oxanium', sans-serif; font-size: 14px; font-weight: 800;
            z-index: 2147483647; box-shadow: 0 0 40px rgba(225, 29, 72, 0.6); display: none;
            pointer-events: none; transition: all 0.5s ease; text-align: center;
            text-transform: uppercase; letter-spacing: 1px;
            animation: warningPulse 2s infinite;
        }
        @keyframes warningPulse {
            0%, 100% { box-shadow: 0 0 40px rgba(225, 29, 72, 0.6); }
            50% { box-shadow: 0 0 60px rgba(225, 29, 72, 0.9); }
        }

        #evo-kick-screen {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(5, 3, 10, 0.98); z-index: 2147483647;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            font-family: 'Oxanium', sans-serif; display: none; pointer-events: all;
        }

        .kick-btn {
            margin-top: 25px; padding: 14px 30px;
            background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #fff;
            border: none; border-radius: 12px; cursor: pointer; font-weight: 800;
            font-size: 15px; transition: all 0.3s ease; text-transform: uppercase;
            box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
        }
        .kick-btn:hover {
            background: linear-gradient(135deg, #6d28d9, #5b21b6);
            transform: scale(1.05) translateY(-2px);
            box-shadow: 0 8px 30px rgba(124,58,237,0.6);
        }
    `;
    document.head.appendChild(styleElement);

    const toggleButton = document.createElement("div");
    toggleButton.id = "evo-toggle-btn";
    toggleButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
    document.body.appendChild(toggleButton);

    const MENU_HTML = `
        <div id="evo-menu">
            <div id="evo-header">
                <span data-i18n="title" style="display:flex;align-items:center;gap:10px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    EVOKID PRO
                </span>
                <span style="display:flex; gap:12px; align-items:center;">
                    <span id="evo-lang-btn" style="cursor:pointer; font-size:11px; border:1px solid rgba(139,92,246,0.5); padding:4px 10px; border-radius:6px; color:white; background:rgba(139,92,246,0.2); transition:all 0.2s;">VN</span>
                    <span id="evo-close">&times;</span>
                </span>
            </div>
            <div class="evo-body">
                <div class="evo-col">
                    <div>
                        <div class="section-title" data-i18n="visuals">VISUALS (ESP)</div>
                        <div class="section">
                            <div class="row"><span data-i18n="visual_cd">Visual CD Timer</span><label class="switch"><input type="checkbox" id="c-cooldown" checked><span class="slider"></span></label></div>
                            <div class="row"><span data-i18n="blaze">Blaze Perfect Arc</span><label class="switch"><input type="checkbox" id="c-player-arc" checked><span class="slider"></span></label></div>
                            <div class="row"><span data-i18n="lines">Draw Target Lines</span><label class="switch"><input type="checkbox" id="c-lines" checked><span class="slider"></span></label></div>
                            <div class="row"><span data-i18n="hitboxes">Show Hitboxes & Level</span><label class="switch"><input type="checkbox" id="c-hitboxes" checked><span class="slider"></span></label></div>
                            <div class="row"><span data-i18n="particles">Particle Effects</span><label class="switch"><input type="checkbox" id="c-particles" checked><span class="slider"></span></label></div>
                        </div>
                    </div>
                    <div>
                        <div class="section-title" data-i18n="utility">MODIFIERS & UTILITY</div>
                        <div class="section">
                            <div class="row"><span data-i18n="zoom">Camera Zoom</span><div class="range-wrap"><input type="range" id="c-zoom" min="0.1" max="4" step="0.05" value="1"><div class="val-disp" id="v-zoom">1.00</div></div></div>
                            <div class="row"><span data-i18n="smooth">Aim Smoothness</span><div class="range-wrap"><input type="range" id="c-smooth" min="1" max="10" step="0.5" value="5"><div class="val-disp" id="v-smooth">5.0</div></div></div>
                            <div class="row"><span data-i18n="predict">Prediction Frames</span><div class="range-wrap"><input type="range" id="c-predict" min="1" max="20" step="1" value="8"><div class="val-disp" id="v-predict">8</div></div></div>
                        </div>
                    </div>
                </div>
                <div class="evo-col">
                    <div>
                        <div class="section-title" data-i18n="combat">COMBAT AUTOMATION</div>
                        <div class="section">
                            <div class="row" style="color: #f43f5e;"><span data-i18n="filter">Filter Low Lv (E)</span><label class="switch"><input type="checkbox" id="c-filter" checked><span class="slider"></span></label></div>
                            <div class="row" style="color: #60a5fa;"><span data-i18n="team">Team Mode (T)</span><label class="switch"><input type="checkbox" id="c-team"><span class="slider"></span></label></div>
                            <div class="row" style="color: #fbbf24;"><span data-i18n="punish">True AI Punish</span><label class="switch"><input type="checkbox" id="c-punish"><span class="slider"></span></label></div>
                            <div class="row" style="color: #34d399;"><span data-i18n="predator">Predator Aim</span><label class="switch"><input type="checkbox" id="c-blaze-aim" checked disabled><span class="slider"></span></label></div>
                            <div class="row"><span data-i18n="dodge">Auto-Dodge</span><label class="switch"><input type="checkbox" id="c-dodge"><span class="slider"></span></label></div>
                            <div class="row"><span data-i18n="sprint">Auto-Sprint</span><label class="switch"><input type="checkbox" id="c-sprint"><span class="slider"></span></label></div>
                            <div class="row"><span data-i18n="hunt">Auto-Hunt</span><label class="switch"><input type="checkbox" id="c-hunt"><span class="slider"></span></label></div>
                            <div class="row"><span data-i18n="attack">Auto-Attack</span><label class="switch"><input type="checkbox" id="c-attack"><span class="slider"></span></label></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    menuContainer = document.createElement("div");
    menuContainer.innerHTML = MENU_HTML;
    document.body.appendChild(menuContainer);

    const menuElement = document.getElementById("evo-menu");
    let menuVisible = false;

    const toggleMenu = () => {
        if (!isAuthenticated) return;
        menuVisible = !menuVisible;
        menuElement.style.display = menuVisible ? "flex" : "none";
        if (menuVisible) {
            menuElement.style.animation = 'none';
            menuElement.offsetHeight;
            menuElement.style.animation = 'menuSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        }
    };

    toggleButton.addEventListener("click", toggleMenu);
    document.getElementById("evo-close").addEventListener("click", toggleMenu);

    let isDragging = false, dragOffsetX, dragOffsetY, menuLeft, menuTop;

    document.getElementById("evo-header").addEventListener("mousedown", e => {
        if (e.target.id === "evo-close" || e.target.id === "evo-lang-btn") return;
        isDragging = true;
        dragOffsetX = e.clientX;
        dragOffsetY = e.clientY;
        const rect = menuElement.getBoundingClientRect();
        menuLeft = rect.left;
        menuTop = rect.top;
        e.preventDefault();
    });

    document.addEventListener("mousemove", e => {
        if (!isDragging) return;
        let newLeft = menuLeft + (e.clientX - dragOffsetX),
            newTop = menuTop + (e.clientY - dragOffsetY);
        menuElement.style.left = Math.max(0, Math.min(newLeft, window.innerWidth - 100)) + "px";
        menuElement.style.top = Math.max(0, Math.min(newTop, window.innerHeight - 50)) + "px";
    });

    document.addEventListener("mouseup", () => isDragging = false);
    menuElement.addEventListener("mousedown", e => e.stopPropagation());

    const config = {
            filter: true,
            lines: true,
            hitboxes: true,
            cooldown: true,
            playerArc: true,
            particles: true,
            punish: false,
            dodge: false,
            sprint: false,
            hunt: false,
            attack: false,
            teamMode: false,
            zoom: 1,
            smooth: 5,
            predict: 8,
            lvlMin: 0,
            lvlMax: 200,
            reachMul: 0.85
        },
        uiRefs = {
            menuCheckboxes: {},
            panelButtons: {}
        },
        syncUI = () => {
            for (let key in uiRefs.menuCheckboxes) {
                if (uiRefs.menuCheckboxes[key]) uiRefs.menuCheckboxes[key].checked = config[key];
            }
            for (let key2 in uiRefs.panelButtons) {
                if (uiRefs.panelButtons[key2]) uiRefs.panelButtons[key2]();
            }
        },
        TRANSLATIONS = {
            vi: {
                title: "EVOKID PRO",
                visuals: "HIỂN THỊ (ESP)",
                visual_cd: "Đếm ngược CD",
                blaze: "Cung Blaze",
                lines: "Đường mục tiêu",
                hitboxes: "Khung hitbox",
                particles: "Hiệu ứng hạt",
                utility: "MODIFIER & TIỆN ÍCH",
                zoom: "Thu phóng Camera",
                smooth: "Độ mượt ngắm",
                predict: "Số frame dự đoán",
                combat: "TỰ ĐỘNG CHIẾN ĐẤU",
                filter: "Lọc cấp thấp",
                team: "Chế độ đồng đội (T)",
                punish: "Tích hợp AI",
                predator: "Ngắm bắn Predator",
                dodge: "Tự né (Dodge)",
                sprint: "Tự tăng tốc (Sprint)",
                hunt: "Tự săn (Hunt)",
                attack: "Tự chém (Attack)",
                p_filter: "Lọc cấp thấp (E)",
                p_team: "Đồng đội (T)",
                p_punish: "Tích hợp AI (P)",
                p_dodge: "Tự né (W)",
                p_attack: "Tự chém (C)",
                p_hunt: "Tự săn (V)",
                p_sprint: "Tự tăng tốc (B)"
            },
            en: {
                title: "EVOKID PRO",
                visuals: "VISUALS (ESP)",
                visual_cd: "Visual CD Timer",
                blaze: "Blaze Perfect Arc",
                lines: "Draw Target Lines",
                hitboxes: "Show Hitboxes",
                particles: "Particle Effects",
                utility: "MODIFIERS & UTILITY",
                zoom: "Camera Zoom",
                smooth: "Aim Smoothness",
                predict: "Prediction Frames",
                combat: "COMBAT AUTOMATION",
                filter: "Filter Low Lv (E)",
                team: "Team Mode (T)",
                punish: "True AI Punish",
                predator: "Predator Aim",
                dodge: "Auto-Dodge",
                sprint: "Auto-Sprint",
                hunt: "Auto-Hunt",
                attack: "Auto-Attack",
                p_filter: "Filter Low Lv (E)",
                p_team: "Team Mode (T)",
                p_punish: "True AI Punish (P)",
                p_dodge: "Auto-Dodge (W)",
                p_attack: "Ghost Hit (C)",
                p_hunt: "Auto-Hunt (V)",
                p_sprint: "Auto-Sprint (B)"
            }
        };

    config.lang = config.lang || "vi";

    const saveConfig = () => localStorage.setItem("evo_ult_cfg_v8", JSON.stringify(config)),
        loadConfig = () => {
            const saved = localStorage.getItem("evo_ult_cfg_v8");
            if (saved) try {
                Object.assign(config, JSON.parse(saved));
            } catch (err) {}
        };
    loadConfig();

    const bindCheckbox = (elId, configKey) => {
        const el = document.getElementById(elId);
        el && (el.checked = config[configKey], uiRefs.menuCheckboxes[configKey] = el, el.addEventListener("change", ev => {
            config[configKey] = ev.target.checked;
            saveConfig();
            syncUI();
        }));
    };

    bindCheckbox("c-filter", "filter");
    bindCheckbox("c-team", "teamMode");
    bindCheckbox("c-lines", "lines");
    bindCheckbox("c-hitboxes", "hitboxes");
    bindCheckbox("c-cooldown", "cooldown");
    bindCheckbox("c-player-arc", "playerArc");
    bindCheckbox("c-punish", "punish");
    bindCheckbox("c-dodge", "dodge");
    bindCheckbox("c-sprint", "sprint");
    bindCheckbox("c-hunt", "hunt");
    bindCheckbox("c-attack", "attack");
    bindCheckbox("c-particles", "particles");

    const bindSlider = (sliderId, dispId, configKey, showVal = true, suffix = "") => {
        const slider = document.getElementById(sliderId),
            disp = document.getElementById(dispId);
        slider.value = config[configKey];
        disp.textContent = (showVal ? config[configKey].toFixed(1) : config[configKey]) + suffix;
        slider.addEventListener("input", ev => {
            config[configKey] = showVal ? parseFloat(ev.target.value) : parseInt(ev.target.value);
            disp.textContent = (showVal ? config[configKey].toFixed(1) : config[configKey]) + suffix;
            saveConfig();
        });
    };

    bindSlider("c-zoom", "v-zoom", "zoom");
    bindSlider("c-smooth", "v-smooth", "smooth");
    bindSlider("c-predict", "v-predict", "predict", false);

    let runtime = null,
        playerType = null,
        gameCanvas = null,
        mouseInstance = null,
        isAimOverriding = false,
        aimX = 0,
        aimY = 0,
        lastAttackTime = 0,
        isRightClickHeld = false,
        lastRightClickTime = 0,
        centerX = window.innerWidth / 2,
        centerY = window.innerHeight / 2,
        dodgeStrafeTimer = 0,
        dodgeStrafeDir = 1;

    const enemyTracker = new Map();
    const particleSystem = [];

    document.addEventListener("mousemove", e => {
        e.isTrusted && (centerX = e.clientX, centerY = e.clientY);
    });

    document.addEventListener("contextmenu", e => {
        if (e.target === gameCanvas) e.preventDefault();
    });

    const overlayCanvas = document.createElement("canvas"),
        ctx = overlayCanvas.getContext("2d");
    document.body.appendChild(overlayCanvas);
    overlayCanvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9997;";
    window.addEventListener("resize", () => {
        overlayCanvas.width = window.innerWidth;
        overlayCanvas.height = window.innerHeight;
    });
    window.dispatchEvent(new Event("resize"));

    // Enhanced particle system
    const createParticle = (x, y, color, type = 'spark') => {
        if (!config.particles) return;
        const count = type === 'spark' ? 5 : 3;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            particleSystem.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.02 + Math.random() * 0.02,
                size: Math.random() * 4 + 2,
                color,
                type
            });
        }
    };

    const updateParticles = () => {
        for (let i = particleSystem.length - 1; i >= 0; i--) {
            const p = particleSystem[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            p.vx *= 0.98;
            p.vy *= 0.98;
            if (p.life <= 0) particleSystem.splice(i, 1);
        }
    };

    const renderParticles = () => {
        for (const p of particleSystem) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace(')', `, ${p.life})`).replace('rgb', 'rgba');
            ctx.fill();
        }
    };

    const getLevel = inst => inst.instance_vars && inst.instance_vars.length > 10 ? inst.instance_vars[10] : 0,

        getTeamId = inst => {
            if (inst.instance_vars && inst.instance_vars.length > 36) {
                const tid = inst.instance_vars[36];
                if (tid !== undefined) return tid;
            }
            return undefined;
        },

        getHitboxPolygon = obj => {
            if (obj.bbox_changed && obj.update_bbox) obj.update_bbox();
            if (obj.collision_poly && typeof obj.collision_poly.is_empty === "function" && !obj.collision_poly.is_empty()) {
                obj.collision_poly.cache_poly(obj.width, obj.height, obj.angle);
                const points = [],
                    ptsCache = obj.collision_poly.pts_cache;
                for (let i = 0; i < obj.collision_poly.pts_count; i++) points.push({
                    x: ptsCache[i * 2] + obj.x,
                    y: ptsCache[i * 2 + 1] + obj.y
                });
                return points;
            }
            if (obj.bquad) {
                const bquad = obj.bquad;
                return [{
                    x: bquad.tlx, y: bquad.tly
                }, {
                    x: bquad.trx, y: bquad.try_
                }, {
                    x: bquad.brx, y: bquad.bry
                }, {
                    x: bquad.blx, y: bquad.bly
                }];
            }
            return [];
        },

        simulateLeftClick = (x, y) => {
            if (!gameCanvas) return;
            gameCanvas.dispatchEvent(new MouseEvent("mousedown", {
                clientX: x, clientY: y, button: 0, bubbles: true
            }));
            setTimeout(() => gameCanvas.dispatchEvent(new MouseEvent("mouseup", {
                clientX: x, clientY: y, button: 0, bubbles: true
            })), 15);
        },

        simulateRightClick = (isDown, x, y) => {
            if (!gameCanvas) return;
            const eventType = isDown ? "mousedown" : "mouseup",
                opts = {
                    clientX: x, clientY: y, button: 2,
                    buttons: isDown ? 2 : 0, bubbles: true, cancelable: true
                };
            gameCanvas.dispatchEvent(new MouseEvent(eventType, opts));
            document.dispatchEvent(new MouseEvent(eventType, opts));
        },

        predictEnemyPosition = null,
        calculateDodgeDirection = null,

        mainTick = () => {
            if (!isAuthenticated || !runtime || !runtime.running_layout || !playerType) return;

            ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            updateParticles();

            const now = performance.now();
            if (now > window.ultimate_angleLockTime) window.ultimate_ghostAngle = null;

            const scrollX = runtime.running_layout.scrollX,
                scrollY = runtime.running_layout.scrollY;

            let localPlayer = null,
                closestDist = Infinity;

            for (const player of playerType.instances) {
                const dist = Math.hypot(player.x - scrollX, player.y - scrollY);
                if (dist < closestDist) {
                    closestDist = dist;
                    localPlayer = player;
                }
            }

            if (!localPlayer) {
                isAimOverriding = false;
                window.ultimate_ghostAngle = null;
                if (isRightClickHeld) {
                    simulateRightClick(false, centerX, centerY);
                    isRightClickHeld = false;
                }
                return;
            }

            const canvasRect = gameCanvas.getBoundingClientRect(),
                canvasCenterX = canvasRect.left + canvasRect.width / 2,
                canvasCenterY = canvasRect.top + canvasRect.height / 2,
                scaleX = canvasRect.width / gameCanvas.width,
                scaleY = canvasRect.height / gameCanvas.height,
                layerScale = localPlayer.layer.getScale(),
                localScreenX = canvasCenterX + (localPlayer.x - scrollX) * layerScale * scaleX,
                localScreenY = canvasCenterY + (localPlayer.y - scrollY) * layerScale * scaleY,
                localLevel = getLevel(localPlayer),
                localTeamId = config.teamMode ? getTeamId(localPlayer) : undefined,
                localRadius = localPlayer.width * 0.35,
                localWeaponData = getWeaponStats(localLevel),
                weaponDistance = localWeaponData.distance,
                weaponDegrees = localWeaponData.degrees,
                reachMultiplier = getArcMultiplier(localLevel, config.reachMul),
                maxReach = weaponDistance * reachMultiplier,
                canAttack = now - lastAttackTime > Math.max(150, localLevel * 20);

            let shouldAttack = false,
                shouldSprint = false,
                attackTarget = null,
                attackTargetDist = Infinity,
                dodgeTarget = null,
                dodgeTargetDist = Infinity,
                huntTarget = null,
                huntTargetDist = Infinity,
                punishTarget = null,
                punishTargetDist = Infinity;
            const activeUids = new Set();

            if (config.hitboxes) {
                const selfHitbox = getHitboxPolygon(localPlayer);
                if (selfHitbox.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(canvasCenterX + (selfHitbox[0].x - scrollX) * layerScale * scaleX, canvasCenterY + (selfHitbox[0].y - scrollY) * layerScale * scaleY);
                    for (let polyIdx = 1; polyIdx < selfHitbox.length; polyIdx++) ctx.lineTo(canvasCenterX + (selfHitbox[polyIdx].x - scrollX) * layerScale * scaleX, canvasCenterY + (selfHitbox[polyIdx].y - scrollY) * layerScale * scaleY);
                    ctx.closePath();
                    ctx.fillStyle = "rgba(34, 197, 94, 0.15)";
                    ctx.fill();
                    ctx.strokeStyle = "#22c55e";
                    ctx.lineWidth = 2;
                    ctx.setLineDash([]);
                    ctx.stroke();
                }
            }

            for (const enemy of playerType.instances) {
                if (enemy.uid === localPlayer.uid || enemy.width <= 0) continue;
                activeUids.add(enemy.uid);

                if (!enemyTracker.has(enemy.uid)) enemyTracker.set(enemy.uid, {
                    wasInThreat: false,
                    attackStart: 0,
                    lastX: enemy.x,
                    lastY: enemy.y,
                    vx: 0,
                    vy: 0
                });

                const enemyData = enemyTracker.get(enemy.uid);

                enemyData.vx = enemy.x - enemyData.lastX;
                enemyData.vy = enemy.y - enemyData.lastY;
                enemyData.lastX = enemy.x;
                enemyData.lastY = enemy.y;

                const dx = localPlayer.x - enemy.x,
                    dy = localPlayer.y - enemy.y,
                    distToEnemy = Math.hypot(dx, dy),
                    enemyLevel = getLevel(enemy),
                    enemyLevelFloored = Math.floor(enemyLevel) + 1,
                    enemyWeaponData = getWeaponStats(enemyLevel),
                    enemyReachMul = getArcMultiplier(enemyLevel, config.reachMul),
                    enemyMaxReach = enemyWeaponData.distance * enemyReachMul,
                    enemyRadius = enemy.width * 0.35,
                    enemyScreenX = canvasCenterX + (enemy.x - scrollX) * layerScale * scaleX,
                    enemyScreenY = canvasCenterY + (enemy.y - scrollY) * layerScale * scaleY;

                const isTeammate = localTeamId !== undefined && getTeamId(enemy) === localTeamId;

                let isValidTarget = true;
                if (isTeammate) isValidTarget = false;
                config.filter && localLevel > enemyLevel && localLevel - enemyLevel >= 15 && (isValidTarget = false);

                const isInLevelRange = enemyLevel >= config.lvlMin && enemyLevel <= config.lvlMax && isValidTarget;

                let threatBuffer = 90;
                (enemyLevelFloored === 27 || enemyLevelFloored === 28) && (threatBuffer += 140);

                const threatRange = enemyMaxReach + localRadius + threatBuffer,
                    isInThreat = distToEnemy < threatRange,
                    isApproaching = enemyData.vx * dx + enemyData.vy * dy < 0;

                isInThreat && !enemyData.wasInThreat && (isApproaching || distToEnemy < enemyMaxReach) && (enemyData.attackStart = now);
                enemyData.wasInThreat = isInThreat;

                // Enhanced arc visualization with gradient
                if (config.playerArc && (isTeammate || isInLevelRange)) {
                    let arcColor, arcFill;
                    if (isTeammate) {
                        arcFill = 'rgba(96, 165, 250, 0.06)';
                        arcColor = 'rgba(96, 165, 250, 0.4)';
                    } else {
                        arcFill = isInThreat ? 'rgba(239, 68, 68, 0.1)' : 'rgba(251, 191, 36, 0.05)';
                        arcColor = isInThreat ? "rgba(239, 68, 68, 0.8)" : "rgba(251, 191, 36, 0.4)";
                    }
                    const gradient = ctx.createRadialGradient(enemyScreenX, enemyScreenY, 0, enemyScreenX, enemyScreenY, enemyMaxReach * layerScale * scaleX);
                    gradient.addColorStop(0, arcFill);
                    gradient.addColorStop(1, 'transparent');
                    ctx.beginPath();
                    ctx.arc(enemyScreenX, enemyScreenY, enemyMaxReach * layerScale * scaleX, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(enemyScreenX, enemyScreenY, enemyMaxReach * layerScale * scaleX, 0, Math.PI * 2);
                    ctx.strokeStyle = arcColor;
                    ctx.lineWidth = 1.5;
                    if (ctx.setLineDash) ctx.setLineDash([5, 5]);
                    ctx.stroke();
                    if (ctx.setLineDash) ctx.setLineDash([]);
                }

                const maxCooldown = Math.max(800, enemyLevel * 60);
                let isSwinging = false,
                    isOnCooldown = false,
                    timeSinceAttack = 0;

                if (enemyData.attackStart) {
                    timeSinceAttack = now - enemyData.attackStart;
                    if (timeSinceAttack < 300) isSwinging = true;
                    else if (timeSinceAttack < maxCooldown) isOnCooldown = true;
                }

                if (!isTeammate) {
                    if (isSwinging && isInThreat) {
                        distToEnemy < dodgeTargetDist && (dodgeTargetDist = distToEnemy, dodgeTarget = enemy);
                    }

                    if (config.punish && isInLevelRange && (isOnCooldown || isSwinging && !isInThreat)) {
                        distToEnemy < punishTargetDist && (punishTargetDist = distToEnemy, punishTarget = enemy);
                    } else if (isInLevelRange && enemyLevel < localLevel && distToEnemy < huntTargetDist) {
                        huntTargetDist = distToEnemy, huntTarget = enemy;
                    }

                    if (isInLevelRange && distToEnemy < maxReach + enemyRadius && distToEnemy < attackTargetDist) {
                        attackTargetDist = distToEnemy, attackTarget = enemy;
                    }
                }

                const enemyRadiusScaled = enemyRadius * layerScale * scaleX;

                if (config.hitboxes) {
                    const enemyHitbox = getHitboxPolygon(enemy);
                    if (enemyHitbox.length > 1) {
                        ctx.beginPath();
                        ctx.moveTo(canvasCenterX + (enemyHitbox[0].x - scrollX) * layerScale * scaleX, canvasCenterY + (enemyHitbox[0].y - scrollY) * layerScale * scaleY);
                        for (let idx = 1; idx < enemyHitbox.length; idx++) ctx.lineTo(canvasCenterX + (enemyHitbox[idx].x - scrollX) * layerScale * scaleX, canvasCenterY + (enemyHitbox[idx].y - scrollY) * layerScale * scaleY);
                        ctx.closePath();

                        if (isTeammate) {
                            ctx.fillStyle = "rgba(96, 165, 250, 0.2)";
                            ctx.fill();
                            ctx.strokeStyle = "#60a5fa";
                            ctx.lineWidth = 2;
                            ctx.setLineDash([4, 4]);
                            ctx.stroke();
                            ctx.setLineDash([]);
                        } else if (isSwinging) {
                            ctx.fillStyle = "rgba(239, 68, 68, 0.35)";
                            ctx.fill();
                            ctx.strokeStyle = "#ef4444";
                            ctx.lineWidth = 3;
                            ctx.stroke();
                        } else if (isOnCooldown) {
                            ctx.fillStyle = "rgba(251, 191, 36, 0.25)";
                            ctx.fill();
                            ctx.strokeStyle = "#fbbf24";
                            ctx.lineWidth = 2.5;
                            ctx.stroke();
                        } else {
                            ctx.fillStyle = isInLevelRange && enemyLevel <= localLevel ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)";
                            ctx.fill();
                            ctx.strokeStyle = isInLevelRange && enemyLevel <= localLevel ? "#22c55e" : isInLevelRange ? "#ef4444" : "#6b7280";
                            ctx.lineWidth = 2;
                            ctx.stroke();
                        }
                    }

                    // Enhanced level display
                    const labelY = enemyScreenY - enemyRadiusScaled - 14;
                    ctx.font = "800 13px 'Oxanium', sans-serif";
                    ctx.textAlign = "center";
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = "rgba(0,0,0,0.8)";

                    const teamLabel = isTeammate ? "TEAM " : "";
                    const levelText = teamLabel + "Lv." + enemyLevelFloored;
                    ctx.strokeText(levelText, enemyScreenX, labelY);

                    const textGradient = ctx.createLinearGradient(enemyScreenX - 30, labelY, enemyScreenX + 30, labelY);
                    if (isTeammate) {
                        textGradient.addColorStop(0, "#60a5fa");
                        textGradient.addColorStop(1, "#3b82f6");
                    } else {
                        textGradient.addColorStop(0, isInLevelRange ? "#ffffff" : "#9ca3af");
                        textGradient.addColorStop(1, isInLevelRange ? "#e2e8f0" : "#6b7280");
                    }
                    ctx.fillStyle = textGradient;
                    ctx.fillText(levelText, enemyScreenX, labelY);

                    // Add small threat/team indicator
                    if (isTeammate) {
                        ctx.fillStyle = '#60a5fa';
                        ctx.beginPath();
                        ctx.arc(enemyScreenX + 30, labelY - 5, 4, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (isSwinging) {
                        ctx.fillStyle = '#ef4444';
                        ctx.beginPath();
                        ctx.arc(enemyScreenX + 25, labelY - 5, 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }

                if (config.cooldown) {
                    if (isTeammate) {
                        ctx.font = "700 12px 'Oxanium', sans-serif";
                        ctx.textAlign = "center";
                        ctx.lineWidth = 3;
                        ctx.strokeStyle = "rgba(0,0,0,0.9)";
                        ctx.strokeText("🤝 TEAM", enemyScreenX, enemyScreenY - enemyRadiusScaled - 32);
                        ctx.fillStyle = "#60a5fa";
                        ctx.fillText("🤝 TEAM", enemyScreenX, enemyScreenY - enemyRadiusScaled - 32);
                    } else if (isSwinging) {
                        ctx.font = "800 14px 'Oxanium', sans-serif";
                        ctx.textAlign = "center";
                        ctx.lineWidth = 4;
                        ctx.strokeStyle = "rgba(0,0,0,0.9)";
                        ctx.strokeText("⚔️ SWINGING!", enemyScreenX, enemyScreenY - enemyRadiusScaled - 32);
                        ctx.fillStyle = "#ef4444";
                        ctx.fillText("⚔️ SWINGING!", enemyScreenX, enemyScreenY - enemyRadiusScaled - 32);

                        // Create particles for swinging enemy
                        createParticle(enemyScreenX, enemyScreenY, 'rgb(239, 68, 68)', 'spark');
                    } else if (isOnCooldown) {
                        const cdText = Math.max(0, (maxCooldown - timeSinceAttack) / 1000).toFixed(1),
                            cdPct = timeSinceAttack / maxCooldown;

                        ctx.font = "700 12px 'Oxanium', sans-serif";
                        ctx.textAlign = "center";
                        ctx.lineWidth = 3;
                        ctx.strokeStyle = "rgba(0,0,0,0.9)";
                        ctx.strokeText("⏳ " + cdText + "s", enemyScreenX, enemyScreenY - enemyRadiusScaled - 32);
                        ctx.fillStyle = "#fbbf24";
                        ctx.fillText("⏳ " + cdText + "s", enemyScreenX, enemyScreenY - enemyRadiusScaled - 32);

                        // Enhanced cooldown bar
                        const barW = 60, barH = 8, barX = enemyScreenX - barW / 2, barY = enemyScreenY - enemyRadiusScaled - 48;

                        // Background
                        ctx.fillStyle = "rgba(0,0,0,0.7)";
                        ctx.beginPath();
                        ctx.roundRect(barX - 2, barY - 2, barW + 4, barH + 4, 4);
                        ctx.fill();

                        // Progress bar
                        const progressGradient = ctx.createLinearGradient(barX, barY, barX + barW, barY);
                        progressGradient.addColorStop(0, '#fbbf24');
                        progressGradient.addColorStop(1, '#f59e0b');
                        ctx.fillStyle = progressGradient;
                        ctx.beginPath();
                        ctx.roundRect(barX, barY, barW * (1 - cdPct), barH, 3);
                        ctx.fill();

                        ctx.strokeStyle = "rgba(251, 191, 36, 0.5)";
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.roundRect(barX, barY, barW, barH, 3);
                        ctx.stroke();
                    }
                }

                if (config.lines && (isTeammate || isInLevelRange)) {
                    ctx.beginPath();
                    ctx.moveTo(localScreenX, localScreenY);
                    ctx.lineTo(enemyScreenX, enemyScreenY);

                    const lineGradient = ctx.createLinearGradient(localScreenX, localScreenY, enemyScreenX, enemyScreenY);
                    if (isTeammate) {
                        lineGradient.addColorStop(0, 'rgba(96, 165, 250, 0.5)');
                        lineGradient.addColorStop(1, 'rgba(96, 165, 250, 0.15)');
                    } else if (isSwinging) {
                        lineGradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
                        lineGradient.addColorStop(1, 'rgba(239, 68, 68, 0.3)');
                    } else if (isOnCooldown) {
                        lineGradient.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
                        lineGradient.addColorStop(1, 'rgba(251, 191, 36, 0.2)');
                    } else {
                        lineGradient.addColorStop(0, 'rgba(139, 92, 246, 0.5)');
                        lineGradient.addColorStop(1, 'rgba(139, 92, 246, 0.15)');
                    }
                    ctx.strokeStyle = lineGradient;
                    ctx.lineWidth = isTeammate ? 1 : (isOnCooldown || isSwinging ? 2.5 : 1.5);
                    ctx.stroke();
                }
            }

            for (const uid of enemyTracker.keys()) {
                if (!activeUids.has(uid)) enemyTracker.delete(uid);
            }

            // Dodge & Aim logic
            if (config.punish && punishTarget) {
                isAimOverriding = true;
                const punishDx = punishTarget.x - localPlayer.x,
                    punishDy = punishTarget.y - localPlayer.y,
                    punishDist = Math.hypot(punishDx, punishDy);
                aimX = canvasCenterX + punishDx / punishDist * 800;
                aimY = canvasCenterY + punishDy / punishDist * 800;
                shouldSprint = true;
            } else if (config.dodge && dodgeTarget) {
                isAimOverriding = true;
                const dodgeDx = localPlayer.x - dodgeTarget.x,
                    dodgeDy = localPlayer.y - dodgeTarget.y,
                    dodgeDist = Math.hypot(dodgeDx, dodgeDy);

                if (dodgeDist > 0) {
                    const retreatX = dodgeDx / dodgeDist,
                        retreatY = dodgeDy / dodgeDist,
                        strafeX = -retreatY,
                        strafeY = retreatX;

                    if (now - dodgeStrafeTimer > 350) {
                        dodgeStrafeTimer = now;
                        dodgeStrafeDir *= -1;
                    }

                    const dodgeScale = Math.min(1.5, Math.max(0.8, 1200 / Math.max(100, dodgeDist))),
                        dodgeRange = 700 * dodgeScale;
                    aimX = canvasCenterX + (retreatX * 0.55 + strafeX * dodgeStrafeDir * 0.45) * dodgeRange;
                    aimY = canvasCenterY + (retreatY * 0.55 + strafeY * dodgeStrafeDir * 0.45) * dodgeRange;
                } else {
                    aimX = canvasCenterX + 800;
                    aimY = canvasCenterY;
                }

                const dodgeData = enemyTracker.get(dodgeTarget.uid),
                    isEarlyAttack = dodgeData && dodgeData.attackStart && now - dodgeData.attackStart < 400,
                    dodgeDistRaw = Math.hypot(localPlayer.x - dodgeTarget.x, localPlayer.y - dodgeTarget.y),
                    dodgeLvl = Math.floor(getLevel(dodgeTarget)) + 1;
                let extraBuf = 40;
                (dodgeLvl === 27 || dodgeLvl === 28) && (extraBuf += 120);
                const inRange = dodgeDistRaw < getWeaponStats(getLevel(dodgeTarget)).distance + localRadius + extraBuf;
                (config.sprint || isEarlyAttack || inRange || !canAttack) && (shouldSprint = true);
            } else if (config.hunt && huntTarget) {
                isAimOverriding = true;
                const huntDx = huntTarget.x - localPlayer.x,
                    huntDy = huntTarget.y - localPlayer.y,
                    huntDist = Math.hypot(huntDx, huntDy);
                aimX = canvasCenterX + huntDx / huntDist * 800;
                aimY = canvasCenterY + huntDy / huntDist * 800;
                if (config.sprint) shouldSprint = true;
            } else {
                isAimOverriding = false;
                aimX = centerX;
                aimY = centerY;
            }

            // Attack logic
            if (config.attack && canAttack && attackTarget) {
                shouldAttack = true;
                const atkData = enemyTracker.get(attackTarget.uid);
                let predictX = attackTarget.x,
                    predictY = attackTarget.y;
                if (atkData) {
                    predictX += atkData.vx * 10;
                    predictY += atkData.vy * 10;
                }
                let arcDeg = weaponDegrees;
                if (attackTarget.width < 150 || getLevel(attackTarget) < 10) {
                    arcDeg = weaponDegrees * 0.4;
                }
                const attackAngle = Math.atan2(predictY - localPlayer.y, predictX - localPlayer.x) + arcDeg * Math.PI / 180;
                let angleDeg = attackAngle * 180 / Math.PI % 360;
                if (angleDeg < 0) angleDeg += 360;
                window.ultimate_ghostAngle = angleDeg;
                window.ultimate_angleLockTime = now + 150;
            }

            // Enhanced player arc display
            if (config.playerArc) {
                let cursorX = isAimOverriding ? aimX : centerX,
                    cursorY = isAimOverriding ? aimY : centerY,
                    worldCursorX = (cursorX - canvasCenterX) / (layerScale * scaleX) + scrollX,
                    worldCursorY = (cursorY - canvasCenterY) / (layerScale * scaleY) + scrollY,
                    aimAngle = window.ultimate_ghostAngle !== null ? window.ultimate_ghostAngle : Math.atan2(worldCursorY - localPlayer.y, worldCursorX - localPlayer.x) * 180 / Math.PI,
                    arcStart = aimAngle * Math.PI / 180 - weaponDegrees * Math.PI / 180;

                // Draw weapon range arc
                ctx.beginPath();
                ctx.arc(localScreenX, localScreenY, weaponDistance * layerScale * scaleX, arcStart - 1.09, arcStart + 1.09, false);
                ctx.strokeStyle = "rgba(34, 197, 94, 0.3)";
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw max reach with gradient fill
                ctx.beginPath();
                ctx.moveTo(localScreenX, localScreenY);
                ctx.arc(localScreenX, localScreenY, maxReach * layerScale * scaleX, arcStart - 1.09, arcStart + 1.09, false);
                ctx.closePath();

                const arcGradient = ctx.createRadialGradient(localScreenX, localScreenY, 0, localScreenX, localScreenY, maxReach * layerScale * scaleX);
                arcGradient.addColorStop(0, 'rgba(34, 197, 94, 0.15)');
                arcGradient.addColorStop(1, 'rgba(34, 197, 94, 0.05)');
                ctx.fillStyle = arcGradient;
                ctx.fill();

                ctx.strokeStyle = "rgba(34, 197, 94, 0.9)";
                ctx.lineWidth = 2.5;
                ctx.stroke();

                // Draw aim line
                ctx.beginPath();
                ctx.moveTo(localScreenX, localScreenY);
                ctx.lineTo(cursorX, cursorY);
                ctx.strokeStyle = "rgba(34, 197, 94, 0.5)";
                ctx.lineWidth = 1;
                ctx.setLineDash([8, 4]);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Render particles
            renderParticles();

            isAimOverriding && mouseInstance && (mouseInstance.mouseXcanvas = aimX, mouseInstance.mouseYcanvas = aimY);

            if (shouldSprint) {
                if (!isRightClickHeld || now - lastRightClickTime > 50) {
                    simulateRightClick(true, aimX || centerX, aimY || centerY);
                    isRightClickHeld = true;
                    lastRightClickTime = now;
                }
            } else if (isRightClickHeld) {
                simulateRightClick(false, aimX || centerX, aimY || centerY);
                isRightClickHeld = false;
            }

            if (shouldAttack && now - lastAttackTime > 60) {
                simulateLeftClick(aimX, aimY);
                lastAttackTime = now;
            }
        },

        animationLoop = () => {
            try {
                if (isAuthenticated && runtime && runtime.running_layout) {
                    for (let layer of runtime.running_layout.layers) {
                        if (layer && layer.scale !== config.zoom) {
                            layer.scale = config.zoom;
                            if (layer.setZIndicesStaleFrom) layer.setZIndicesStaleFrom(0);
                        }
                    }
                    mainTick();
                } else {
                    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
                    particleSystem.length = 0;
                    isAimOverriding = false;
                    window.ultimate_ghostAngle = null;
                    if (isRightClickHeld) {
                        simulateRightClick(false, centerX, centerY);
                        isRightClickHeld = false;
                    }
                }
            } catch (e) {}
            requestAnimationFrame(animationLoop);
        },

        hookGame = () => {
            gameCanvas = runtime.canvas;
            gameCanvas && gameCanvas.addEventListener("mousemove", mouseProto => {
                isAimOverriding && (mouseProto.stopImmediatePropagation(), mouseProto.stopPropagation());
            }, true);

            if (window.cr.plugins_.Mouse) {
                const mouseProto = window.cr.plugins_.Mouse.prototype.Instance.prototype,
                    origMouseMove = mouseProto.onMouseMove;
                mouseProto.onMouseMove = function() {
                    mouseInstance = this;
                    origMouseMove.apply(this, arguments);
                    isAimOverriding && (this.mouseXcanvas = aimX, this.mouseYcanvas = aimY);
                };
            }

            if (window.cr.plugins_.NSG_PowerWS) {
                const wsProto = window.cr.plugins_.NSG_PowerWS.prototype.Instance.prototype,
                    origTick = wsProto.tick;
                wsProto.tick = function() {
                    if (this.wsWorker && !this.wsWorker._ultimateHooked) {
                        this.wsWorker._ultimateHooked = true;
                        const type_ = this.wsWorker.postMessage;
                        this.wsWorker.postMessage = function(msg) {
                            return msg && msg.action === "send" && msg.data && msg.data.a === "ps" && window.ultimate_ghostAngle !== null && (msg.data.d.a = Math.round(window.ultimate_ghostAngle)), type_.apply(this, arguments);
                        };
                    }
                    origTick.apply(this, arguments);
                };
            }

            for (const type_ of runtime.types_by_index) {
                if (type_ && type_.instvar_sids && type_.instvar_sids.length === 72) {
                    playerType = type_;
                    break;
                }
            }

            animationLoop();
        };

    const createShortcutPanel = () => {
        const panel = document.createElement("div");
        panel.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: linear-gradient(180deg, rgba(20, 15, 35, 0.9), rgba(12, 10, 18, 0.95));
            backdrop-filter: blur(12px);
            border: 1px solid rgba(139, 92, 246, 0.4);
            border-radius: 16px; padding: 16px;
            display: flex; flex-direction: column; gap: 10px;
            z-index: 99999; font-family: 'Oxanium', sans-serif;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(139, 92, 246, 0.2);
            opacity: 0.6; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        panel.addEventListener("mouseenter", () => {
            panel.style.opacity = "1";
            panel.style.background = "linear-gradient(180deg, rgba(25, 20, 45, 0.98), rgba(15, 12, 25, 0.98))";
            panel.style.transform = "scale(1.02)";
            panel.style.boxShadow = "0 15px 50px rgba(0,0,0,0.6), 0 0 30px rgba(139, 92, 246, 0.3)";
        });
        panel.addEventListener("mouseleave", () => {
            panel.style.opacity = "0.6";
            panel.style.background = "linear-gradient(180deg, rgba(20, 15, 35, 0.9), rgba(12, 10, 18, 0.95))";
            panel.style.transform = "scale(1)";
            panel.style.boxShadow = "0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(139, 92, 246, 0.2)";
        });
        document.body.appendChild(panel);

        const inner = document.createElement("div");
        inner.id = "evo-expire-disp";
        inner.style.cssText = `
            color: #10b981; font-size: 11px; font-weight: 700;
            text-align: center; margin-bottom: 8px;
            border-bottom: 1px solid rgba(139, 92, 246, 0.3);
            padding-bottom: 10px; letter-spacing: 1px; min-height: 18px;
            text-transform: uppercase;
        `;
        panel.appendChild(inner);

        const addBtn = (event, changed, el) => {
            const updateFn = document.createElement("div");
            const key = () => {
                const label = TRANSLATIONS[config.lang][event];
                updateFn.innerHTML = `<span>${el} ${label}</span> <span style="color:${config[changed] ? '#10b981' : '#ef4444'};font-weight:700;">${config[changed] ? 'ON' : 'OFF'}</span>`;
                updateFn.style.background = config[changed] ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(109, 40, 217, 0.3))' : 'rgba(39, 39, 42, 0.6)';
                updateFn.style.border = config[changed] ? '1px solid rgba(139, 92, 246, 0.6)' : '1px solid rgba(63, 63, 70, 0.6)';
                updateFn.style.boxShadow = config[changed] ? '0 0 15px rgba(139, 92, 246, 0.3)' : 'none';
            };
            updateFn.style.cssText = `
                padding: 10px 14px; border-radius: 10px; cursor: pointer;
                color: #fff; font-size: 12px; font-weight: 600;
                display: flex; justify-content: space-between; gap: 15px;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            `;
            updateFn.addEventListener("click", () => {
                config[changed] = !config[changed];
                saveConfig();
                syncUI();
            });
            updateFn.addEventListener("mouseenter", () => {
                updateFn.style.transform = "translateX(4px)";
            });
            updateFn.addEventListener("mouseleave", () => {
                updateFn.style.transform = "translateX(0)";
            });
            key();
            panel.appendChild(updateFn);
            uiRefs.panelButtons[changed] = key;
        };

        addBtn("p_filter", "filter", "🔍");
        addBtn("p_team", "teamMode", "👥");
        addBtn("p_punish", "punish", "🤖");
        addBtn("p_dodge", "dodge", "🏃");
        addBtn("p_attack", "attack", "⚔️");
        addBtn("p_hunt", "hunt", "🎯");
        addBtn("p_sprint", "sprint", "⚡");

        syncUI();

        document.addEventListener("keydown", event => {
            if (document.activeElement.tagName === "INPUT") return;
            let changed = false;
            switch (event.key.toLowerCase()) {
                case "e":
                    config.filter = !config.filter;
                    changed = true;
                    break;
                case "t":
                    config.teamMode = !config.teamMode;
                    changed = true;
                    break;
                case "p":
                    config.punish = !config.punish;
                    changed = true;
                    break;
                case "w":
                    config.dodge = !config.dodge;
                    changed = true;
                    break;
                case "c":
                    config.attack = !config.attack;
                    changed = true;
                    break;
                case "v":
                    config.hunt = !config.hunt;
                    changed = true;
                    break;
                case "b":
                    config.sprint = !config.sprint;
                    changed = true;
                    break;
                case "insert":
                    toggleMenu();
                    break;
            }
            changed && (saveConfig(), syncUI());
        });
    },

    applyTranslation = () => {
        const langStrings = TRANSLATIONS[config.lang];
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (langStrings[key]) el.textContent = langStrings[key];
        });
        document.getElementById("evo-lang-btn").textContent = config.lang === "vi" ? "🇻🇳 VN" : "🇺🇸 EN";
        syncUI();
    },

    activateMod = () => {
        isAuthenticated = true;
        const lockScreen = document.getElementById("evo-lock-screen");
        if (lockScreen) lockScreen.remove();
        document.getElementById("evo-toggle-btn").style.display = "flex";
        menuVisible = true;
        menuElement.style.display = "flex";

        const pollInterval = setInterval(() => {
            window.cr_getC2Runtime && (runtime = window.cr_getC2Runtime()) && (clearInterval(pollInterval), hookGame(), createShortcutPanel());
        }, 500);
    };

    setTimeout(() => {
        activateMod();
        const langBtn = document.getElementById("evo-lang-btn");
        langBtn && langBtn.addEventListener("click", () => {
            config.lang = config.lang === "vi" ? "en" : "vi";
            saveConfig();
            applyTranslation();
        });
        applyTranslation();
    }, 300);
})();