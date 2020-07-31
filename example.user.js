// ==UserScript==
// @name         Example 
// @namespace    example
// @version      0.1
// @description  Fill out forms automatically!
// @include      /^https?://localhost:8072*/
// @require      <path_to_utils.js>
// @resource     utilsCSS <path_to_style.css>
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

/*jshint esversion: 6 */
(function () {
    'use strict';
    
    const pages = [
        {
            url: '8072/#/login',
            datasets: [
                {
                    name: 'correct',
                    buttonLabel: 'Correct',
                    shortcut: ['d','1'],
                    data: [
                        { name: 'loginAlias', value: 'bill' },
                        { name: 'loginAliasPassword', value: 'password' },
                    ]
                },
                {
                    name: 'incorrect',
                    buttonLabel: 'Incorrect',
                    shortcut: ['d','2'],
                    data: [
                        { name: 'loginAlias', value: 'billIncorrect' },
                        { name: 'loginAliasPassword', value: 'passwordWrong' },
                    ]
                },
                {
                    name: 'custom',
                    buttonLabel: 'Custom',
                    shortcut: ['d','3'],
                    data: [
                        { name: 'loginAlias', value: 'billCustom' },
                        { name: 'loginAliasPassword', value: 'password' },
                    ]
                },
            ]
        }
    ];

    const delayInMs = 100;

    initAutofill(pages, delayInMs);
})();

function initAutofill(pages, delayInMs) {
    GM_addStyle(GM_getResourceText("utilsCSS"));
    autofill(pages, delayInMs);
}