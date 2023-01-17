// ==UserScript==
// @name         servicenow content enhancer
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Improved customizability and user experience of servicenow courses
// @match        https://nowlearning.servicenow.com/*
// @match        https://rustici.nowlearning.servicenow.com/courses/default/*/index.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// ==/UserScript==

(function() {
    'use strict';

    //Code
    function addSettingsMenu(selector) {
        const observer = new MutationObserver((mutationList) => {
            mutationList.forEach((mutation) => {
                mutation.addedNodes.forEach((element) => {
                    if (element.nodeType === Node.ELEMENT_NODE) {
                        if (element.querySelector(selector)) {
                            element = element.querySelector(selector)
                        }

                        if (element.matches(selector) && !element.querySelector('.SettingsMenuOpen')) {
                            if (selector === '.nav .dropdown-menu:not(#Certification, #Help, .notification-menu)') {
                                element.insertAdjacentHTML('beforeend', `
                                <li>
                                    <button class="SettingsMenuOpen">
                                        Userscript Settings
                                    </button>
                                </li>
                                `)
                            } else if (selector === '.nav-control__wrapper') {
                                element.insertAdjacentHTML('beforeend', `
                                <div style="position: absolute; right: 16rem; top: 0; z-index: 3">
                                    <button class="SettingsMenuOpen" style="margin: 0.8rem 1rem; text-align: center; border-radius: 4px; background: hsla(0,0%,100%,.8); padding: 0 1rem">
                                        USERSCRIPT SETTINGS
                                    </button>
                                </div>
                                `)
                            } else if (selector === '.page-view.page-view--visible') {
                                element.insertAdjacentHTML('beforeend', `
                                <style>
                                    @media (max-width: 47.9375em){.page-view.page-view--visible>.SettingsMenuOpen {display: none !important}}
                                    .page-view.page-view--visible>.SettingsMenuOpen {position: absolute; top: 1.5rem; right: 12rem; background: none; border: none; font-size: 1.2rem; font-weight: 700; letter-spacing: .03rem; color: #959fa5; z-index: 1000; cursor: pointer}
                                </style>
                                <button class="SettingsMenuOpen">
                                    USERSCRIPT SETTINGS
                                </button>
                                `)
                            } else if (selector === '.page__menu') {
                                element.insertAdjacentHTML('beforeend', `
                                <style>
                                    @media (max-width: 47.9375em){.page__menu>.SettingsMenuOpen {display: block !important}}
                                    .page__menu>.SettingsMenuOpen {position: absolute; top: 0; right: 12rem; background: none; border: none; font-size: 1.1rem; font-weight: 700; letter-spacing: .02rem; color: #959fa5; z-index: 1000; cursor: pointer; display: none; height: 5rem;}
                                </style>
                                <button class="SettingsMenuOpen">
                                    USERSCRIPT SETTINGS
                                </button>
                                `)
                            }

                            element.querySelector('.SettingsMenuOpen').addEventListener('click', () => {
                                document.body.insertAdjacentHTML('beforeend', `
                                <div class="SettingsMenu">
                                    <div class="SettingsMenuContent">
                                        <button class="SettingsMenuClose">×</button>
                                        <form>
                                            <label>Expand course window: <input type="checkbox" for="ExpandContent"></label>
                                            <label>Remove animations: <input type="checkbox" for="RemoveAnimation"></label>
                                            <label>Remove bubble fade in: <input type="checkbox" for="RemoveBubbleFadeIn"></label>
                                            <label>Remove overflow fade: <input type="checkbox" for="RemoveOverflowFade"></label>
                                            <label>Remove lesson transition: <input type="checkbox" for="RemoveLessonTransition"></label>
                                            <label>First bubble primary color: <input type="color" for="FirstBubbleColorPrimary"></label>
                                            <label>First bubble secondary color: <input type="color" for="FirstBubbleColorSecondary"></label>
                                            <button class="SettingsMenuDefault">Default</button>
                                            <button class="SettingsMenuUnset">Unset all</button>
                                        </form>
                                    </div>
                                </div>
                                `)

                                function updateInputValue(input) {
                                    if (input.type === 'checkbox') {
                                        input.checked = GM_getValue(input.getAttribute('for'), true)
                                    } else if (input.getAttribute('for') === 'FirstBubbleColorPrimary') {
                                        input.value = GM_getValue(input.getAttribute('for'), '#d64c4c')
                                    } else if (input.getAttribute('for') === 'FirstBubbleColorSecondary') {
                                        input.value = GM_getValue(input.getAttribute('for'), '#ffffff')
                                    }
                                }

                                document.querySelector('.SettingsMenu .SettingsMenuClose').addEventListener('click', () => {
                                    document.querySelector('.SettingsMenu').remove()
                                })

                                document.querySelector('.SettingsMenu .SettingsMenuDefault').addEventListener('click', (event) => {
                                    event.preventDefault()
                                    GM_setValue('ExpandContent', true)
                                    GM_setValue('RemoveAnimation', true)
                                    GM_setValue('RemoveBubbleFadeIn', true)
                                    GM_setValue('RemoveOverflowFade', true)
                                    GM_setValue('RemoveLessonTransition', true)
                                    GM_setValue('FirstBubbleColorPrimary', '#d64c4c')
                                    GM_setValue('FirstBubbleColorSecondary', '#ffffff')

                                    for (let index = 0; index < document.querySelectorAll('.SettingsMenu form input').length; index++) {
                                        const input = document.querySelectorAll('.SettingsMenu form input')[index];

                                        updateInputValue(input)
                                    }
                                })

                                document.querySelector('.SettingsMenu .SettingsMenuUnset').addEventListener('click', (event) => {
                                    event.preventDefault()
                                    GM_setValue('ExpandContent', false)
                                    GM_setValue('RemoveAnimation', false)
                                    GM_setValue('RemoveBubbleFadeIn', false)
                                    GM_setValue('RemoveOverflowFade', false)
                                    GM_setValue('RemoveLessonTransition', false)
                                    GM_setValue('FirstBubbleColorPrimary', '#ffffff')
                                    GM_setValue('FirstBubbleColorSecondary', '#72d64c')

                                    for (let index = 0; index < document.querySelectorAll('.SettingsMenu form input').length; index++) {
                                        const input = document.querySelectorAll('.SettingsMenu form input')[index];

                                        updateInputValue(input)
                                    }
                                })

                                for (let index = 0; index < document.querySelectorAll('.SettingsMenu form input').length; index++) {
                                    const input = document.querySelectorAll('.SettingsMenu form input')[index];

                                    updateInputValue(input)

                                    input.addEventListener('input', () => {
                                        GM_setValue(input.getAttribute('for'), input.type === 'checkbox' ? input.checked : input.value);
                                    })
                                }
                            })
                            observer.disconnect()
                        }
                    }
                })
            })
        })
        document.body.insertAdjacentHTML('afterbegin', `
        <style>
            .hidden-xs .nav .dropdown-menu:not(#Certification, #Help, .notification-menu) button {border: none; background-color: #fff; padding: 15px 25px; width: 100%; font-size: 16px; text-align: left}
            .hidden-xs .nav .dropdown-menu:not(#Certification, #Help, .notification-menu) button:hover {background-color: #f5f5f5}
            .visible-xs .nav .dropdown-menu:not(#Certification, #Help, .notification-menu) button {border: none; background-color: #293E40; color: #bdc0c4; padding: 5px 15px 5px 25px; width: 100%; font-size: 16px; text-align: left}
            .visible-xs .nav .dropdown-menu:not(#Certification, #Help, .notification-menu) button:hover {color: #fff}

            .SettingsMenu {position: fixed; top: 0; z-index: 9999; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.5); font-family: arial}
            .SettingsMenu .SettingsMenuContent {margin: 30px auto; border-radius: 6px; width: 50vw; min-width: 300px; background-color: #fff; box-shadow: 0 5px 15px rgb(0 0 0 / 50%);}
            .SettingsMenu form {padding: 15px}
            .SettingsMenu form label {display: block; margin: 10px 0; font-size: 16px; width: fit-content}
            .SettingsMenu form button {margin-right: 10px; padding: 5px 30px; background-color: #284441; color: #fff; border: 1px solid transparent; border-radius: 3px; text-align: center; vertical-align: middle;}
            .SettingsMenu form button:hover {background-color: #152021; cursor: pointer}
            .SettingsMenuClose {border: none; background-color: transparent; margin: 15px; float: right; font-size: 32px; cursor: pointer}
        </style>
        `)

        observer.observe(document.body, {childList: true, subtree: true})
    }

    if (window.location.href.startsWith("https://nowlearning.servicenow.com/")) {
        addSettingsMenu('.nav .dropdown-menu:not(#Certification, #Help, .notification-menu)')

        function updateStyle() {
            if (document.body.querySelector('.contentEnhancerStyle') === null) {document.body.insertAdjacentHTML('afterbegin', `<style class="contentEnhancerStyle"></style>`)}

            document.body.querySelector('.contentEnhancerStyle').innerHTML = `
            ${GM_getValue("ExpandContent", true) ? `
                body.modal-open:has(.rustici-modal-window iframe) {overflow-y: hidden !important}
                .rustici-modal-window {overflow-y: hidden !important}
                .rustici-modal-window .modal-dialog {margin: 0 !important;width: 100vw !important;height: 100vh !important}
                .rustici-modal-window .modal-content {padding: 0 !important;border: 0 !important;width: 100vw !important;height: 100vh !important}
                .rustici-modal-window iframe {height: calc(100vh - 36px) !important}
            ` : ''}`
        }

        GM_addValueChangeListener('ExpandContent', updateStyle)

        updateStyle()
    } else {
        if (window.location.href.substring(59, 63) === 'CITM') {
            addSettingsMenu('.nav-control__wrapper')
        } else if (window.location.href.substring(59, 62) === 'LES') {
            addSettingsMenu('.page-view.page-view--visible')
            addSettingsMenu('.page__menu')
        }

        function updateStyle() {
            if (document.body.querySelector('.contentEnhancerStyle') === null) {document.body.insertAdjacentHTML('afterbegin', `<style class="contentEnhancerStyle"></style>`)}

            document.body.querySelector('.contentEnhancerStyle').innerHTML = `
            ${GM_getValue("RemoveAnimation", true) ? `
                .animated {animation-duration: 0s !important;opacity: 1 !important}
                .labeled-graphic-canvas {transition-duration: 0s !important}
            ` : ''}

            ${GM_getValue("RemoveBubbleFadeIn", true) ? `
                .labeled-graphic-marker {transform: scale(1) !important; opacity: 1 !important; box-shadow: none !important}
                .labeled-graphic-marker--visible {transition-delay: 0s !important}
                .labeled-graphic-marker__pin:after {content: none !important}
            ` : ''}

            ${GM_getValue("RemoveOverflowFade", true) ? `
                .bubble__body--has-overflow:after {content: none !important;}
                .flashcard-side__content--long-overflow-bottom:after {content: none !important}
            ` : ''}

            ${GM_getValue("RemoveLessonTransition", true) ? `
                .page__wrapper {animation-duration: 0s !important}
                .page__content {transition-duration: 0s !important}
                .page-transition-back-leave {animation-duration: 0s !important}
                .page-transition-back-enter {animation-duration: 0s !important}
                .page-transition-leave {animation-duration: 0s !important}
                .page-transition-enter {animation-duration: 0s !important}
            ` : ''}

            .labeled-graphic-canvas__figure .map-item:first-child .labeled-graphic-marker__pin {background-color: ${GM_getValue("FirstBubbleColorPrimary", '#d64c4c')} !important; color: ${GM_getValue("FirstBubbleColorSecondary", '#ffffff')} !important}
            .labeled-graphic-canvas__figure .map-item:first-child button:not(.labeled-graphic-marker--active):hover .labeled-graphic-marker__pin:before {border-color: ${GM_getValue("FirstBubbleColorSecondary", '#ffffff')} !important}
            .labeled-graphic-canvas__figure .map-item:first-child .labeled-graphic-marker--active .labeled-graphic-marker__pin {background-color: ${GM_getValue("FirstBubbleColorSecondary", '#ffffff')} !important; color: ${GM_getValue("FirstBubbleColorPrimary", '#d64c4c')} !important}
            .labeled-graphic-canvas__figure .map-item:first-child .labeled-graphic-marker--active .labeled-graphic-marker__pin:before {border-color: ${GM_getValue("FirstBubbleColorPrimary", '#d64c4c')} !important}`
        }

        GM_addValueChangeListener('RemoveAnimation', updateStyle)
        GM_addValueChangeListener('RemoveBubbleFadeIn', updateStyle)
        GM_addValueChangeListener('RemoveOverflowFade', updateStyle)
        GM_addValueChangeListener('RemoveLessonTransition', updateStyle)
        GM_addValueChangeListener('FirstBubbleColorPrimary', updateStyle)
        GM_addValueChangeListener('FirstBubbleColorSecondary', updateStyle)

        updateStyle()

        const observer = new MutationObserver((mutationList) => {
            const selector = '.labeled-graphic-canvas__image'

            mutationList.forEach((mutation) => {
                mutation.addedNodes.forEach((element) => {
                    if (element.nodeType === Node.ELEMENT_NODE) {
                        if (element.querySelector(selector)) {
                            element = element.querySelector(selector)
                        }

                        if (element.matches(selector)) {
                            element.addEventListener('click', (event) => {
                                if (element.parentElement.querySelector('.bubble--active')) {return}
                                setTimeout(() => {element.parentElement.querySelector('.map-item:first-child button').click()})
                            })
                        }
                    }
                })
            })
        })

        observer.observe(document.body, {childList: true, subtree: true})
    }
})();