const copyProfilebutton = document.getElementById('profile-html-cpy-btn');
const text = document.getElementById('html-cpy-txt');

const copyJobDescriptionbutton = document.getElementById('job-description-html-cpy-btn');

const disableButton = (button) => {
    button.disabled = true;
    button.style.cursor = 'not-allowed';
    button.style.backgroundColor = '#d3d3d3';
    button.style.color = '#000000';
}

const enableButton = (button) => {
    button.disabled = false;
}

const domain = 'https://aicvpro.com';
// const domain = 'http://localhost:8007';
const localDomain = 'http://localhost:3000';

const createResumeEndpoint = '/api/send-resume/get-clean-resume-text';
const sendJobDescriptionEndpoint = '/api/send-job-description/get-clean-job-description-text';

const redirectCreateResumeUri = '/create?tab=copy-paste';
const redirectJobDescriptionCopyUri = '/builder?jobDescription=copy-paste';

const redirectCreateResumeUrl = domain + redirectCreateResumeUri;
const redirectJobDescriptionCopyUrl = domain + redirectJobDescriptionCopyUri;

const createResumeApi = domain + createResumeEndpoint;
const sendJobDescriptionApi = domain + sendJobDescriptionEndpoint;

const getHtml = () => {
    var html = document.getElementsByTagName('html')[0].innerHTML;
    return html;
}

if (copyProfilebutton) {
    copyProfilebutton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length > 0) {
                const firstTab = tabs[0];
                if (!firstTab.url) {
                    text.innerText = "Please open your LinkedIn profile first";
                    return;
                }
                if (!firstTab.url.includes('linkedin.com/')) {
                    text.innerText = "Please open your LinkedIn profile first";
                    return;
                }
                disableButton(copyProfilebutton);
                disableButton(copyJobDescriptionbutton);
                chrome.tabs.sendMessage(firstTab.id ?? -1, { message: 'copy-html-action' }, (resume) => {
                    if (resume) {
                        var xhr = new XMLHttpRequest();
                        copyProfilebutton.innerText = "Sending...";
                        text.innerText = "Copied profile is being processed...";

                        xhr.open('POST', createResumeApi, true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify({ resume }));

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4 && xhr.status == 200) {
                                navigator.clipboard.writeText(
                                    xhr.responseText
                                ).then(() => {
                                    copyProfilebutton.innerText = "Copied!";
                                    chrome.tabs.update({ url: redirectCreateResumeUrl });
                                    window.close();
                                }).catch((e) => {
                                    copyProfilebutton.innerText = "Error!";
                                });

                                text.innerText = xhr.responseText;

                                setTimeout(() => {
                                    copyProfilebutton.innerText = "Send Profile to AICVPro";
                                }, 4000);
                            }
                        }

                        xhr.onerror = function () {
                            copyProfilebutton.innerText = "Error!";
                        }

                        xhr.onload = function () {
                            copyProfilebutton.innerText = "Loaded!";
                        }

                        xhr.onprogress = function () {
                            copyProfilebutton.innerText = "Loading...";
                        }

                        xhr.ontimeout = function () {
                            copyProfilebutton.innerText = "Timeout!";
                        }
                    }
                });
            } else {
                alert('Please open your LinkedIn profile first');
            }

        });
    }
    );
}

if (copyJobDescriptionbutton) {
    copyJobDescriptionbutton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length > 0) {
                const firstTab = tabs[0];

                if (!firstTab.url) {
                    text.innerText = "Please open a job description first";
                    return;
                }

                if (!firstTab.url.includes(`linkedin.com/jobs/view/`)) {
                    text.innerText = "Please open a job description first";
                    return;
                }

                chrome.tabs.sendMessage(firstTab.id ?? -1, { message: 'copy-html-action' }, (jobDescription) => {
                    if (jobDescription) {
                        disableButton(copyProfilebutton);
                        disableButton(copyJobDescriptionbutton);
                        var xhr = new XMLHttpRequest();
                        copyJobDescriptionbutton.innerText = "Sending...";
                        text.innerText = "Copied job description is being processed...";

                        xhr.open('POST', sendJobDescriptionApi, true);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify({ jobDescription }));

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4 && xhr.status == 200) {
                                navigator.clipboard.writeText(
                                    xhr.responseText
                                ).then(() => {
                                    copyJobDescriptionbutton.innerText = "Copied!";
                                    text.innerText = xhr.responseText;
                                    chrome.tabs.update({ url: redirectJobDescriptionCopyUrl });
                                    window.close();
                                }).catch((e) => {
                                    copyJobDescriptionbutton.innerText = "Error!";
                                });

                                text.innerText = xhr.responseText;

                                setTimeout(() => {
                                    copyJobDescriptionbutton.innerText = "Send Job Description to AICVPro";
                                }, 4000);
                            }
                        }

                        xhr.onerror = function () {
                            copyJobDescriptionbutton.innerText = "Error!";
                        }

                        xhr.onload = function () {
                            copyJobDescriptionbutton.innerText = "Loaded!";
                        }

                        xhr.onprogress = function () {
                            copyJobDescriptionbutton.innerText = "Loading...";
                        }

                        xhr.ontimeout = function () {
                            copyJobDescriptionbutton.innerText = "Timeout!";
                        }
                    }
                });
            } else {
                alert('Please open a job description first');
            }

        });
    }
    );
}

chrome.runtime.onMessage.addListener(function (payload, sender, sendResponse) {
    if (payload.message === 'copy-html-action') {
        sendResponse(getHtml());
    }
});
