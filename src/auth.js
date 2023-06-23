chrome.storage.local.get(['url'], function (result) {
    const url = new URL(result.url);
    const error = url.searchParams.get('error');
    const error_description = url.searchParams.get('error_description');
    const $txtTip = $('#txtTip');

    function showError(txt) {
        $txtTip.removeClass('text-success').addClass('text-danger').text(txt);
    }

    if (error) {
        showError('Error: ' + error + (error_description ? ', ' + error_description : ''));
        return;
    }

    let clipboard = new ClipboardJS(".clipboard");
    clipboard.on("success", (e) => {
        e.clearSelection();
        $(".copy-result").removeClass('text-danger').addClass('text-success').text("复制成功！");
    });
    clipboard.on("error", (e) => {
        $(".copy-result").removeClass('text-success').addClass('text-danger').text("复制失败。");
    });

    const data = {
        "redirect_uri": url.protocol + url.pathname,
        "grant_type": "authorization_code",
        "client_id": "pdlLIX2Y72MIl2rhLhTE9VV9bN905kBh",
        "code": url.searchParams.get('code'),
        "code_verifier": url.searchParams.get('state'),
    };
    fetch('https://auth0.openai.com/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw Error(data.error + ', ' + data.error_description);
            }

            $("#accessToken").text(data.access_token);
            $("#fullData").text(JSON.stringify(data, null, 2));

            $txtTip.slideUp();
            $("#stepThree").slideDown();
        })
        .catch((error) => {
            showError(error);
        });
});
