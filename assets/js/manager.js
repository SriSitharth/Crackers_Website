//Global Variable Declaration
var jsonData = "";
var totalProduct = 0;
var lastOpenPanel = '';
var lastOpenHeight = '';
$(document).ready(function () {
    // Retrieve the values from session storage and local storage
    var sessionData = JSON.parse(sessionStorage.getItem('jsonData'));
    var localData = JSON.parse(localStorage.getItem('jsonData'));
    // Compare the values from two storage
    if (JSON.stringify(sessionData) === JSON.stringify(localData)) {
        $.getJSON('crackers.json', function (data) {
            storeDataInSessionStorage(data);
            storeDataInLocalStorage(data);
            jsonData = JSON.parse(localStorage.getItem('jsonData'));
            loadAccordion(jsonData);
        });
    } else if (sessionStorage.length == 1) {
        $.getJSON('crackers.json', function (data) {
            storeDataInSessionStorage(data);
            storeDataInLocalStorage(data);
            jsonData = JSON.parse(localStorage.getItem('jsonData'));
            loadAccordion(jsonData);
        });
    } else {
        jsonData = JSON.parse(sessionStorage.getItem('jsonData'));
        loadAccordion(jsonData);
    }
    // Delete Category
    $('#accordionContainer').on('click', '.btnDelete', function () {
        var myId = $(this).attr('id');
        const index = myId.split("_")[2];
        jsonData.crackers.splice(index, 1);
        $("#header_" + index).remove();
        $("#panel_" + index).remove();
        $('#accordionContainer').empty();
        sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
        loadAccordion(jsonData);
    });
    // Delete Items
    $('#accordionContainer').on('click', '.btnDeleteItem', function () {
        var myId = $(this).attr('id');
        const myArray = myId.split("_");
        var ctgId = myArray[1];
        var itemId = myArray[2];
        jsonData.crackers[ctgId].items.splice(itemId, 1);
        $('#div_' + ctgId + '_' + itemId).remove();
        $('#accordionContainer').empty();
        sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
        loadAccordion(jsonData);
    });
    // Edit Category
    $('#accordionContainer').on('click', '.btnEdit', function () {
        var myId = $(this).attr('id');
        const myArray = myId.split("_");
        var ctgId = myArray[2];
        var newCategory = $('#ctgName_' + ctgId).val();
        jsonData.crackers[ctgId].category = newCategory;
        $('#accordionContainer').empty();
        sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
        loadAccordion(jsonData);
    });
    // Edit Items
    $('#accordionContainer').on('click', '.btnEditItem', function () {
        var myId = $(this).attr('id');
        const myArray = myId.split("_");
        var ctgId = myArray[1];
        var itemId = myArray[2];
        var newName = $('#Name_' + ctgId + '_' + itemId).val();
        var newPrice = $('#Price_' + ctgId + '_' + itemId).val();
        jsonData.crackers[ctgId].items[itemId].name = newName;
        jsonData.crackers[ctgId].items[itemId].price = newPrice;
        $('#accordionContainer').empty();
        sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
        loadAccordion(jsonData);
    });
    // Add Category
    $('#accordionContainer').on('click', '.btnAdd', function () {
        var myId = $(this).attr('id');
        const myArray = myId.split("_");
        var ctgId = myArray[2];
        var newCategory = {
            "category": "Enter New Category",
            "categoryTotal": 0,
            "items": [
                {
                    "id": totalProduct + 1,
                    "name": "",
                    "img": "assets/img/icons/proDefault.jpg",
                    "img2": "",
                    "img3": "",
                    "price": "",
                    "quantity": 0,
                    "total": 0
                }
            ]
        }
        totalProduct++;
        $('#accordionContainer').empty();
        var test = parseInt(ctgId) + 1;
        jsonData.crackers.splice(test, 0, newCategory);
        sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
        loadAccordion(jsonData);
    });
    // Add Item
    $('#accordionContainer').on('click', '.btnAddItem', function () {
        var myId = $(this).attr('id');
        const myArray = myId.split("_");
        var ctgId = myArray[1];
        var itemId = myArray[2];
        var newItem = {
            "id": (totalProduct + 1),
            "name": "",
            "img": "assets/img/icons/proDefault.jpg",
            "img2": "",
            "img3": "",
            "price": "",
            "quantity": 0,
            "total": 0
        }
        totalProduct++;
        $('#accordionContainer').empty();
        jsonData.crackers[ctgId].items.splice(itemId + 1, 0, newItem);
        sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
        loadAccordion(jsonData);
    });
    // First Photo Change
    $('#accordionContainer').on('change', '.imageUpload1', function () {
        const file = this.files[0];
        var myId = $(this).attr('id');
        const myArray = myId.split("_");
        var ctgId = myArray[2];
        var itemId = myArray[3];
        if (file) {
            let reader = new FileReader();
            reader.onload = function (event) {
                var newImagePath = event.target.result;
                $('#thumbnail_' + ctgId + '_' + itemId + '').attr("src", event.target.result);
                jsonData.crackers[ctgId].items[itemId].img = newImagePath;
                $('#fileName_1_' + ctgId + '_' + itemId + '').text(file.name);

                var fileName = jsonData.crackers[ctgId].category + '_' + itemId + '_' + 1;
                var formData = new FormData();
                formData.append("fileName", fileName);
                formData.append("file", file);
                $.ajax({
                    url: 'https://localhost:9595/api/FileUpload/UploadFile',
                    type: 'POST',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        jsonData.crackers[ctgId].items[itemId].img = "Images/" + fileName;
                    },
                    error: function (xhr, status, error) {
                    }
                });

            };
            reader.readAsDataURL(file);
            $('#label_2_' + ctgId + '_' + itemId + '').attr('style', 'display: initial');
            $('#fileName_2_' + ctgId + '_' + itemId + '').attr('style', 'display: initial');
        }
    });
    //  Second Photo Change
    $('#accordionContainer').on('change', '.imageUpload2', function () {
        const file = this.files[0];
        var myId = $(this).attr('id');
        const myArray = myId.split("_");
        var ctgId = myArray[2];
        var itemId = myArray[3];
        if (file) {
            let reader = new FileReader();
            reader.onload = function (event) {
                var newImagePath = event.target.result;
                $('#thumbnail_' + ctgId + '_' + itemId + '').attr("src", event.target.result);
                jsonData.crackers[ctgId].items[itemId].img2 = newImagePath;
                $('#fileName_2_' + ctgId + '_' + itemId + '').text(file.name);

                var fileName = jsonData.crackers[ctgId].category + '_' + itemId + '_' + 2;
                var formData = new FormData();
                formData.append("fileName", fileName);
                formData.append("file", file);
                $.ajax({
                    url: 'https://localhost:9595/api/FileUpload/UploadFile',
                    type: 'POST',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        jsonData.crackers[ctgId].items[itemId].img2 = "Images/" + fileName;
                        // Handle the server response if needed
                        console.log("success");
                    },
                    error: function (xhr, status, error) {
                        // Handle errors if any
                        console.log("error");
                    }
                });

            };
            reader.readAsDataURL(file);
            $('#label_3_' + ctgId + '_' + itemId + '').attr('style', 'display: initial');
            $('#fileName_3_' + ctgId + '_' + itemId + '').attr('style', 'display: initial');
        }
    });
    // Third Photo Change
    $('#accordionContainer').on('change', '.imageUpload3', function () {
        const file = this.files[0];
        var myId = $(this).attr('id');
        const myArray = myId.split("_");
        var ctgId = myArray[2];
        var itemId = myArray[3];
        if (file) {
            let reader = new FileReader();
            reader.onload = function (event) {
                var newImagePath = event.target.result;
                $('#thumbnail_' + ctgId + '_' + itemId + '').attr("src", event.target.result);
                jsonData.crackers[ctgId].items[itemId].img3 = newImagePath;
                $('#fileName_3_' + ctgId + '_' + itemId + '').text(file.name);

                var fileName = jsonData.crackers[ctgId].category + '_' + itemId + '_' + 3;
                var formData = new FormData();
                formData.append("fileName", fileName);
                formData.append("file", file);
                $.ajax({
                    url: 'https://localhost:9595/api/FileUpload/UploadFile',
                    type: 'POST',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        jsonData.crackers[ctgId].items[itemId].img3 = "Images/" + fileName;
                        // Handle the server response if needed
                        console.log("success");
                    },
                    error: function (xhr, status, error) {
                        // Handle errors if any
                        console.log("error");
                    }
                });

            };
            reader.readAsDataURL(file);
        }
    });

    //Span to display image
    $('#accordionContainer').on('click', 'span', function () {
        var myId = $(this).attr('id');
        const myArray = myId.split("_");
        var ctgId = myArray[2];
        var itemId = myArray[3];
        if (myArray[1] == 1) {
            $('#thumbnail_' + ctgId + '_' + itemId + '').attr("src", jsonData.crackers[ctgId].items[itemId].img);
        } else if (myArray[1] == 2) {
            $('#thumbnail_' + ctgId + '_' + itemId + '').attr("src", jsonData.crackers[ctgId].items[itemId].img2);
        } else if (myArray[1] == 3) {
            $('#thumbnail_' + ctgId + '_' + itemId + '').attr("src", jsonData.crackers[ctgId].items[itemId].img3);
        }
        else {
            return false;
        }
    })
    //Reset Button Function
    $('#resetBtn').on('click', function (e) {
        e.preventDefault();
        $('#accordionContainer').empty();
        var storedData = localStorage.getItem('jsonData');
        jsonData = JSON.parse(storedData);
        sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
        loadAccordion(jsonData);
    })
    //Save Button Function
    $('#saveBtn').on('click', function () {
        // Assign count to id number
        var itemCount = 0;
        $.each(jsonData.crackers, function (index, category) {
            $.each(category.items, function (i, item) {
                itemCount++;
                jsonData.crackers[index].items[i].id = itemCount;
            })
        })
        sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
        localStorage.setItem('jsonData', JSON.stringify(jsonData));
        // Ajax post request for update original Json
        $.ajax({
            url: 'https://localhost:9595/api/FileUpload/UploadJson',
            type: 'POST',
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(jsonData),
            success: function (response) {
                console.log("success");
            },
            error: function (xhr, status, error) {
                // Handle errors if any
                console.log("error");
            }
        })
        return false;
    });
    // Checkbox click function
    $('#accordionContainer').on('click', '.arrival', function () {
        var myId = $(this).attr('id');
        const myArray = myId.split("_");
        var ctgId = myArray[1];
        var itemId = myArray[2];
        if ($('#arrival_' + ctgId + '_' + itemId + '').is(":checked")) {
            jsonData.crackers[ctgId].items[itemId].isChecked = true;
        } else {
            jsonData.crackers[ctgId].items[itemId].isChecked = false;
        }
    })
    // Clock time and other details change
    $('#detailsSubmit').on('click', function () {
        var ownerEmail = $('#inputEmail').val();
        if (ownerEmail != jsonData.emailId) {
            jsonData.emailId = ownerEmail;
            $('#inputEmail').val(jsonData.emailId);
            alert("Email Updated");
        }
        var ownerPhone = $('#inputPhone').val();
        if (ownerPhone != jsonData.phoneNumber) {
            jsonData.phoneNumber = ownerPhone;
            $('#inputPhone').val(jsonData.phoneNumber);
            alert("Phone Number Updated");
        }
        var ownerPhone2 = $('#inputPhone2').val();
        if (ownerPhone2 != jsonData.secondaryNumber) {
            jsonData.secondaryNumber = ownerPhone2;
            $('#inputPhone2').val(jsonData.secondaryNumber);
            alert("Secondary Number Updated");
        }
        var ownerAddress = $('#inputAddress').val();
        if (ownerAddress != jsonData.shopAddress) {
            jsonData.shopAddress = ownerAddress;
            $('#inputAddress').val(jsonData.shopAddress);
            alert("Address Updated");
        }
        var date = new Date($('#diwaliDate').val());
        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();
        var inputDate = ([year, month, day].join('/'));
        if (inputDate != jsonData.diwaliDate) {
            jsonData.diwaliDate = inputDate;
            $('#diwaliDate').val((jsonData.diwaliDate.split("/").join("-")));
            alert("Date Updated");
        }
    });
});

// Main Accordion Loading Function
function loadAccordion(jsonData) {
    removeEvent();
    var itemCount = 0;
    $.each(jsonData.crackers, function (index, category) {
        var htmlOut = '<div id="header_' + index + '" class="customAccordion row d-flex" draggable="true" ondragstart="drag(event)">'
        htmlOut += '<div  class="col d-inline-flex justify-content-start child_' + index + '"><span><input type="name" class="ctgName" id="ctgName_' + index + '" value="' + category.category + '"></span></div>'
        htmlOut += '<div  class="col d-inline-flex justify-content-end child_' + index + '"><button id = "header_btnAdd_' + index + '"class="btnAdd">Add</button><button class="btnEdit" id="header_btnEdit_' + index + '">Update</button>'
        htmlOut += '<button id = "header_btnDelete_' + index + '"class="btnDelete">Delete</button></div>'
        htmlOut += '</div>'
        htmlOut += '<div class="panel" id="panel_' + index + '">'
        htmlOut += '<p><table><thead><tr><th> # </th><th>Image</th><th>Name</th><th>Price</th><th>Action Button</th></tr></thead><tbody id="draggable" ondrop="dropItems(event)" ondragover="allowDropItems(event)">'
        $.each(category.items, function (i, item) {
            itemCount++;
            htmlOut += '<tr id="div_' + index + '_' + i + '" draggable="true" ondragstart="dragItems(event)">'
            htmlOut += '<td class="item_' + index + '_' + i + '"><input type="checkbox" id="arrival_' + index + '_' + i + '" class="arrival" value="' + item.isChecked + '">  ' + itemCount + '</td>'
            htmlOut += ' <td class="item_' + index + '_' + i + '"><img src="' + item.img + '" class="productImg" id="thumbnail_' + index + '_' + i + '" >'
            htmlOut += '<input type="file" class="imageUpload1" accept="image/*" id="Image_1_' + index + '_' + i + '" required hidden><label for="Image_1_' + index + '_' + i + '">Choose File</label><span id="fileName_1_' + index + '_' + i + '">No file chosen</span><br>'
            htmlOut += '<input type="file" class="imageUpload2" accept="image/*" id="Image_2_' + index + '_' + i + '" hidden><label for="Image_2_' + index + '_' + i + '" id="label_2_' + index + '_' + i + '" class="label" style="display:none">Choose File</label><span id="fileName_2_' + index + '_' + i + '" style="display:none">No file chosen</span><br>'
            htmlOut += '<input type="file" class="imageUpload3" accept="image/*" id="Image_3_' + index + '_' + i + '" hidden><label for="Image_3_' + index + '_' + i + '" id="label_3_' + index + '_' + i + '" class="label" style="display:none">Choose File</label><span id="fileName_3_' + index + '_' + i + '" style="display:none">No file chosen</span></td>'
            htmlOut += '<td class="item_' + index + '_' + i + '"><input type="text" class="productName" id="Name_' + index + '_' + i + '" value="' + item.name + '" placeholder="Name" required></td>'
            htmlOut += '<td class="item_' + index + '_' + i + '"><input type="number" class="productPrice" min="0" id="Price_' + index + '_' + i + '"  value="' + item.price + '" placeholder="Price" required></td>'
            htmlOut += '<td class="item_' + index + '_' + i + '"><button class="btnAddItem" id="btnAdd_' + index + '_' + i + '" >Add</button>'
            htmlOut += '<button class="btnEditItem" id="btnEdit_' + index + '_' + i + '" >Update</button>'
            htmlOut += '<button class="btnDeleteItem" id="btnDelete_' + index + '_' + i + '" >Delete</button>'
            htmlOut += '</td></tr>'
            totalProduct = itemCount;
        });
        htmlOut += '</tbody></table></p>'
        htmlOut += '</div>';
        $('#accordionContainer').append(htmlOut);
    });
    $('#inputEmail').val(jsonData.emailId);
    $('#inputPhone').val(jsonData.phoneNumber);
    $('#inputPhone2').val(jsonData.secondaryNumber);
    $('#inputAddress').val(jsonData.shopAddress);
    var date = (jsonData.diwaliDate.split("/").join("-"));
    $('#diwaliDate').val(date);
    loadCheckbox();
    addEvent();
    openPanel();
}

// Open the Last Opened Panel
function openPanel() {
    if (lastOpenPanel != '') {
        lastOpenHeight = lastOpenHeight + 80;
        var idName = $(lastOpenPanel).attr('id');
        $('#' + idName + '').prev().addClass("active");
        $('#' + idName + '').css("max-height", (lastOpenHeight + "px"));
    }
}
// For add event listener for accordion
function removeEvent() {
    var acc = document.getElementsByClassName("customAccordion");
    var i;
    for (i = 0; i < acc.length; i++) {
        acc[i].removeEventListener("click", function () {
        });
    }
}
// For add event listener for accordion
function addEvent() {
    var acc = document.getElementsByClassName("customAccordion");
    var i;
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            }
            else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                lastOpenPanel = panel;
                lastOpenHeight = panel.scrollHeight;
            }
        });
    }
}
// For add event listener for accordion
function addAfterEvent() {
    var acc = document.getElementsByClassName("customAccordion");
    var i;
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            }
            else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
}
// Function to store data in sessionStorage
function storeDataInSessionStorage(data) {
    sessionStorage.setItem('jsonData', JSON.stringify(data));
}
// Function to store data in localStorage
function storeDataInLocalStorage(data) {
    localStorage.setItem('jsonData', JSON.stringify(data));
}
// Function for Category Drag and Drop
function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var dropIndex = "";
    const dragIndex = data.split("_")[1];
    thisdiv = ev.target;
    if ($(thisdiv).attr('id') == undefined) {
        var classList = $(thisdiv).attr('class').split(" ");
        $.each(classList, function (index, str1) {
            if (str1.indexOf("child_") != -1) {
                const index = str1.split("_")[1];
                dropIndex = index;
                return;
            }
        });
    }
    else {
        const index = $(thisdiv).attr('id').split("_")[1];
        dropIndex = index;
    }
    var obj = jsonData.crackers[dragIndex];
    jsonData.crackers.splice(dragIndex, 1);
    jsonData.crackers.splice(dropIndex, 0, obj)
    $('#accordionContainer').empty();
    loadAccordion(jsonData);
}
// Function for Items Drag and Drop
function allowDropItems(ev) {
    ev.preventDefault();
}
function dragItems(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
function dropItems(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    const dragCtgIndex = data.split("_")[1];
    const dragItemIndex = data.split("_")[2];

    var dropCtgIndex = dragCtgIndex;
    thisdiv = ev.target;
    var dropItemIndex = $(thisdiv).attr('id').split("_")[2];

    var obj = jsonData.crackers[dragCtgIndex].items[dragItemIndex];
    jsonData.crackers[dragCtgIndex].items.splice(dragItemIndex, 1);
    jsonData.crackers[dropCtgIndex].items.splice(dropItemIndex, 0, obj);
    $('#accordionContainer').empty();
    loadAccordion(jsonData);
}
// For Loading the checkbox checked
function loadCheckbox() {
    var checked = 0;
    $.each(jsonData.crackers, function (index, category) {
        $.each(category.items, function (i, item) {
            if (item.isChecked === true) {
                $('#arrival_' + index + '_' + i + '').prop('checked', true);
                checked++;
            }
            else {
                $('#arrival_' + index + '_' + i + '').prop('checked', false);
            }
        })
    })
    if (checked < 3) {
        alert("Atleast 3 Items must be Checked for new Arrival");
    }
}
