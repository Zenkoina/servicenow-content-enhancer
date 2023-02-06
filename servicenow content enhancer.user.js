// ==UserScript==
// @name         servicenow content enhancer
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  Improved customizability and user experience of servicenow courses
// @match        https://nowlearning.servicenow.com/*
// @match        https://rustici.nowlearning.servicenow.com/courses/default/*/index.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// ==/UserScript==

(function() {
    'use strict';

    //Constants
    const Defaults = {
        'ExpandContent': true,
        'RemoveAnimation': true,
        'RemoveBubbleFadeIn': true,
        'RemoveOverflowFade': true,
        'RemoveLessonTransition': true,
        'FirstBubbleColorPrimary': '#d64c4c',
        'FirstBubbleColorSecondary': '#ffffff'
    }

    //Code
    function addSettingsMenu(selector, disconnectAfterFound) {
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
                            } else if (selector === '.rustici-modal-window .modal-content div') {
                                element.querySelector('.rustici-close-btn').insertAdjacentHTML('afterend', `
                                <button class="SettingsMenuOpen btn pull-right" style="height: 36px; font-weight: normal">
                                    Userscript Settings
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
                                        input.checked = GM_getValue(input.getAttribute('for'), Defaults[input.getAttribute('for')])
                                    } else if (input.type === 'color') {
                                        input.value = GM_getValue(input.getAttribute('for'), Defaults[input.getAttribute('for')])
                                    }
                                }

                                document.querySelector('.SettingsMenu .SettingsMenuClose').addEventListener('click', () => {
                                    document.querySelector('.SettingsMenu').remove()
                                })

                                document.querySelector('.SettingsMenu .SettingsMenuDefault').addEventListener('click', (event) => {
                                    event.preventDefault()
                                    GM_deleteValue('ExpandContent')
                                    GM_deleteValue('RemoveAnimation')
                                    GM_deleteValue('RemoveBubbleFadeIn')
                                    GM_deleteValue('RemoveOverflowFade')
                                    GM_deleteValue('RemoveLessonTransition')
                                    GM_deleteValue('FirstBubbleColorPrimary')
                                    GM_deleteValue('FirstBubbleColorSecondary')

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
                                    GM_setValue('FirstBubbleColorPrimary', '')
                                    GM_setValue('FirstBubbleColorSecondary', '')

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
                            if (disconnectAfterFound) {
                                observer.disconnect()
                            }
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
        addSettingsMenu('.nav .dropdown-menu:not(#Certification, #Help, .notification-menu)', true)
        addSettingsMenu('.rustici-modal-window .modal-content div', false)

        function updateStyle() {
            if (document.body.querySelector('.contentEnhancerStyle') === null) {document.body.insertAdjacentHTML('afterbegin', `<style class="contentEnhancerStyle"></style>`)}

            document.body.querySelector('.contentEnhancerStyle').innerHTML = `
            ${GM_getValue("ExpandContent", Defaults.ExpandContent) ? `
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
        function updateStyle() {
            if (document.body.querySelector('.contentEnhancerStyle') === null) {document.body.insertAdjacentHTML('afterbegin', `<style class="contentEnhancerStyle"></style>`)}
            const FirstBubbleColorPrimary = GM_getValue('FirstBubbleColorPrimary', Defaults.FirstBubbleColorPrimary)
            const FirstBubbleColorSecondary = GM_getValue('FirstBubbleColorSecondary', Defaults.FirstBubbleColorSecondary)

            document.body.querySelector('.contentEnhancerStyle').innerHTML = `
            ${GM_getValue("RemoveAnimation", Defaults.RemoveAnimation) ? `
                .animated {animation-duration: 0s !important;opacity: 1 !important}
                .labeled-graphic-canvas {transition-duration: 0s !important}
            ` : ''}

            ${GM_getValue("RemoveBubbleFadeIn", Defaults.RemoveBubbleFadeIn) ? `
                .labeled-graphic-marker {transform: scale(1) !important; opacity: 1 !important; box-shadow: none !important}
                .labeled-graphic-marker--visible {transition-delay: 0s !important}
                .labeled-graphic-marker__pin:after {content: none !important}
            ` : ''}

            ${GM_getValue("RemoveOverflowFade", Defaults.RemoveOverflowFade) ? `
                .bubble__body--has-overflow:after {content: none !important;}
                .flashcard-side__content--long-overflow-bottom:after {content: none !important}
            ` : ''}

            ${GM_getValue("RemoveLessonTransition", Defaults.RemoveLessonTransition) ? `
                .page__wrapper {animation-duration: 0s !important}
                .page__content {transition-duration: 0s !important}
                .page-transition-back-leave {animation-duration: 0s !important}
                .page-transition-back-enter {animation-duration: 0s !important}
                .page-transition-leave {animation-duration: 0s !important}
                .page-transition-enter {animation-duration: 0s !important}
            ` : ''}

            ${(FirstBubbleColorPrimary || FirstBubbleColorSecondary) ? `
                .labeled-graphic-canvas__figure .map-item:first-child button:not(.labeled-graphic-marker--active) .labeled-graphic-marker__pin {${FirstBubbleColorPrimary ? `background-color: ${FirstBubbleColorPrimary} !important; ` : ''}${FirstBubbleColorSecondary ? `color: ${FirstBubbleColorSecondary} !important` : ''}}
                ${FirstBubbleColorSecondary ? `.labeled-graphic-canvas__figure .map-item:first-child button:not(.labeled-graphic-marker--active):hover .labeled-graphic-marker__pin:before {border-color: ${FirstBubbleColorSecondary} !important}` : ''}
                .labeled-graphic-canvas__figure .map-item:first-child button.labeled-graphic-marker--active .labeled-graphic-marker__pin {${FirstBubbleColorSecondary ? `background-color: ${FirstBubbleColorSecondary} !important; ` : ''}${FirstBubbleColorPrimary ? `color: ${FirstBubbleColorPrimary} !important` : ''}}
                ${FirstBubbleColorPrimary ? `.labeled-graphic-canvas__figure .map-item:first-child button.labeled-graphic-marker--active .labeled-graphic-marker__pin:before {border-color: ${FirstBubbleColorPrimary} !important}` : ''}
            ` : ''}`
        }

        GM_addValueChangeListener('RemoveAnimation', updateStyle)
        GM_addValueChangeListener('RemoveBubbleFadeIn', updateStyle)
        GM_addValueChangeListener('RemoveOverflowFade', updateStyle)
        GM_addValueChangeListener('RemoveLessonTransition', updateStyle)
        GM_addValueChangeListener('FirstBubbleColorPrimary', updateStyle)
        GM_addValueChangeListener('FirstBubbleColorSecondary', updateStyle)

        updateStyle()

        new MutationObserver((mutationList) => {
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
        }).observe(document.body, {childList: true, subtree: true})
    }
})();