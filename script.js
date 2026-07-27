const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let tool = "pencil";

let isDrawing = false;

let startX = 0;
let startY = 0;

let currentX = 0;
let currentY = 0;

let color = "#000000";

let lineWidth = 5;

let canvasImage = null;


let isFilled = false;


function selectTool(selectedTool, button) {

    tool = selectedTool;

    const buttons =
        document.querySelectorAll(".tool-button");

    buttons.forEach(function(btn) {
        btn.classList.remove("active");
    });

    button.classList.add("active");
}


function toggleFill(button) {

    isFilled = !isFilled;

    if (isFilled) {
        button.textContent = "⬛ Fill : ON";
    } else {
        button.textContent = "⬛ Fill : OFF";
    }

}


function selectColor(selectedColor, button) {

    color = selectedColor;

    const buttons =
        document.querySelectorAll(".color-button");

    buttons.forEach(function(btn) {
        btn.classList.remove("active");
    });

    button.classList.add("active");
}



const widthSlider =
    document.getElementById("widthSlider");

const widthValue =
    document.getElementById("widthValue");


widthSlider.addEventListener("input", function() {

    lineWidth = Number(widthSlider.value);

    widthValue.textContent =
        lineWidth + " px";

});



function toScaledMousePos(posX, posY) {

    const rect =
        canvas.getBoundingClientRect();

    const scaleX =
        canvas.width / rect.width;

    const scaleY =
        canvas.height / rect.height;

    return {

        x: Math.floor(
            (posX - rect.left) * scaleX
        ),

        y: Math.floor(
            (posY - rect.top) * scaleY
        )

    };

}



canvas.addEventListener(
    "mousedown",
    function(event) {

        const pos =
            toScaledMousePos(
                event.clientX,
                event.clientY
            );

        startX = pos.x;
        startY = pos.y;

        currentX = pos.x;
        currentY = pos.y;

        isDrawing = true;


        canvasImage =
            ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );




        if (
            tool === "pencil" ||
            tool === "eraser"
        ) {

            ctx.beginPath();

            ctx.moveTo(
                startX,
                startY
            );

        }

    }
);



canvas.addEventListener(
    "mousemove",
    function(event) {

        if (!isDrawing) {
            return;
        }


        const pos =
            toScaledMousePos(
                event.clientX,
                event.clientY
            );


        currentX = pos.x;
        currentY = pos.y;


 

        if (tool === "pencil") {

            ctx.strokeStyle = color;

            ctx.lineWidth = lineWidth;

            ctx.lineCap = "round";

            ctx.lineTo(
                currentX,
                currentY
            );

            ctx.stroke();

        }


  
        else if (tool === "eraser") {

            ctx.strokeStyle = "white";

            ctx.lineWidth =
                lineWidth * 2;

            ctx.lineCap = "round";

            ctx.lineTo(
                currentX,
                currentY
            );

            ctx.stroke();

        }




        else {

            showPreview();

        }

    }
);




canvas.addEventListener(
    "mouseup",
    function(event) {

        if (!isDrawing) {
            return;
        }


        const pos =
            toScaledMousePos(
                event.clientX,
                event.clientY
            );


        currentX = pos.x;
        currentY = pos.y;



        if (
            tool === "line" ||
            tool === "rect" ||
            tool === "circle"
        ) {

            ctx.putImageData(
                canvasImage,
                0,
                0
            );

        }


        if (tool === "line") {

            drawLine(
                startX,
                startY,
                currentX,
                currentY
            );

        }



        else if (tool === "rect") {

            drawRectangle(
                startX,
                startY,
                currentX,
                currentY
            );

        }



        else if (tool === "circle") {

            drawCircle(
                startX,
                startY,
                currentX,
                currentY
            );

        }


        isDrawing = false;

    }
);



canvas.addEventListener(
    "mouseleave",
    function() {

        if (
            tool === "pencil" ||
            tool === "eraser"
        ) {

            isDrawing = false;

        }

    }
);

function drawLine(
    x1,
    y1,
    x2,
    y2
) {

    ctx.beginPath();

    ctx.moveTo(
        x1,
        y1
    );

    ctx.lineTo(
        x2,
        y2
    );

    ctx.strokeStyle =
        color;

    ctx.lineWidth =
        lineWidth;

    ctx.lineCap =
        "round";

    ctx.stroke();

}



function drawRectangle(
    x1,
    y1,
    x2,
    y2
) {

    ctx.beginPath();

    ctx.rect(
        x1,
        y1,
        x2 - x1,
        y2 - y1
    );

    if (isFilled) {

        ctx.fillStyle = color;
        ctx.fill();
    
    } else {
    
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    
    }

}



function drawCircle(
    x1,
    y1,
    x2,
    y2
) {

    const centerX =
        (x1 + x2) / 2;

    const centerY =
        (y1 + y2) / 2;

    const radiusX =
        Math.abs(x2 - x1) / 2;

    const radiusY =
        Math.abs(y2 - y1) / 2;


    ctx.beginPath();

    ctx.ellipse(
        centerX,
        centerY,
        radiusX,
        radiusY,
        0,
        0,
        Math.PI * 2
    );

    if (isFilled) {

        ctx.fillStyle = color;
        ctx.fill();
    
    } else {
    
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    
    }
}



function showPreview() {



    ctx.putImageData(
        canvasImage,
        0,
        0
    );


    if (tool === "line") {

        drawLine(
            startX,
            startY,
            currentX,
            currentY
        );

    }

    else if (tool === "rect") {

        drawRectangle(
            startX,
            startY,
            currentX,
            currentY
        );

    }

    else if (tool === "circle") {

        drawCircle(
            startX,
            startY,
            currentX,
            currentY
        );

    }

}



function clearCanvas() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}