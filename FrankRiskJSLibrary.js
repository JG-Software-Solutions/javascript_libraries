/* INSTALL CODE
<script>
    if (typeof FrankRiskForms == 'undefined') {
        var script = document.createElement("script");
        var version = new Date().getTime();
        script.src = "https://cdn.jsdelivr.net/gh/JG-Software-Solutions/javascript_libraries@release/FrankRiskJSLibrary.js?v="+version;
        document.getElementsByTagName('head')[0].appendChild(script);
    }    
</script>
*/

var FrankRiskForms = (function() {
    var methods = {};

    var script = document.createElement("script");
    var version = new Date().getTime();
    script.src = "https://cdn.jsdelivr.net/gh/JG-Software-Solutions/javascript_libraries@release/jquery-3.6.0.js?v="+version;
    document.getElementsByTagName('head')[0].appendChild(script);

    /*<script>
    if (typeof FrankRiskForms != 'undefined') {
        FrankRiskForms.loadSPForm('75474567457', 1, '#form1', 'https://www.frankrisk.co.nz/liability-renewal-declaration');
    }
    </script>*/

    methods.loadSPForm = function(formID, formNumber, element, saveURL = null) {
        var scriptLoad = document.createElement('script');
        scriptLoad.setAttribute('src', 'https://www.cognitoforms.com/f/seamless.js');
        scriptLoad.setAttribute('data-key', formID);
        scriptLoad.setAttribute('data-form', formNumber);
        document.getElementsByTagName('head')[0].append(scriptLoad);

        WaitForCognito(function(){
            if (typeof _spPageContextInfo !== undefined && typeof Cognito !== undefined) {
                var fields = {
                    "UPN": _spPageContextInfo.userEmail,
                    "AAD": _spPageContextInfo.aadUserId,
                    "UserDisplayName": _spPageContextInfo.userDisplayName
                }; 
                formContext = Cognito.mount(formNumber, element).prefill(fields);
                formContext.on('ready', function(event) {     
                    console.log("Form Fully Loaded");
                    $('.cog-form__container').append('<style>.cognitoForm_'+formNumber+'_floatChildButtonRight .cog-button {float: right !important;} .cog-dialog .el-dialog {opacity: 1 !important;}.cog-form, .cog-form > .cog-form__container {max-width: 100% !important; width: 100% !important;} [class$="floatChildButtonRight"] { margin-top: -2rem !important; }</style>');
                    if ($($('.cog-form__container .cog-body .cog-page .cog-row')[0]).find('.cog-button--save').length == 0) {
                        var saveButton = $('div.cog-form__container div.cog-page__navigation button.cog-button--save').clone();
                        var resetButton = $('div.cog-form__container div.cog-page__navigation button.cog-button--save').clone();
                        resetButton.find('.cog-button__text').text("Reset Form");
                        resetButton.on('click', function() {
                            window.location.href = window.location.href.split('#')[0];
                        });
                        resetButton.css('margin-right', '1rem');
                        saveButton.on('click', function() {
                            $('div.cog-form__container div.cog-page__navigation button.cog-button--save').click();
                        });
                        var cogHeader = $($('.cog-form__container .cog-body .cog-page .cog-row')[0]);
                        var row = $('<div class="cog-col cog-col--24 cognitoForm_'+formNumber+'_floatChildButtonRight"></div>');
                        row.append(saveButton);
                        row.append(resetButton);
                        cogHeader.append(row);
                    }
                });

                if (saveURL != null && saveURL != "" && saveURL != "null" && saveURL != undefined) {
                    formContext.on('afterSave', function(event) {
                        var link = event.data.link.split(/\#+/);
                        if (link.length > 1) {
                            var code = link[1];
                            var newLink = saveURL + "#" + code;
                            $('#cog-cog-save-resume-link').val(newLink);
                        }
                        $('.cog-dialog .el-dialog__wrapper .el-dialog .el-dialog__body .cog-row:last-child').remove();
                    });
                }
            }
        });

        function WaitForCognito(callback) {
            if (typeof Cognito !== "undefined") {
                console.log('Cognito API Loaded');
                callback();
            } else {
                setTimeout(function() {
                WaitForCognito(callback);
                }, 100);
            }
        }
    };

    return methods;
})();
