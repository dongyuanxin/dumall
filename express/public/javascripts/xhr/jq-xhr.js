let load = () => {
    $("#send-btn-post").click(() => {
        $.ajax({
            type:"POST",
            url:"/learn/api",
            dataType:"json",
            data:{ // GET方法不需要
                number:$("#name-input").val()
            },
            success:(data) => {
                console.log(JSON.stringify(data.query));
                $("#server-info").html("success");
            },
            error:(jqXHR) => {
                $("#server-info").html("fail");
            }
        })
    });
}
$(document).ready(() => {
    load();
});