$("document").ready(function(){
    
    // -------- ALLOWING USER TO CHANGE LIST NAME --------
    // on click of the save button on the modal
    $("#save-button").on("click",function(e){
        // get value from text area element
        var newTitle = $('textarea#message-text').val();
        
        // clearing the text area
        $('textarea#message-text').val("");
        
        changeListTitle(newTitle);
    });

    // -------- ALLOWING USER TO ADD ITEM TO LIST --------
    // on click of the "add item" button
    $("#input-button").click(function(){
        
        console.log("input click");
        
        // getting user input
        // checks if item name is valid
        if ($("#new-item-name").val() == ""){ // if item name is empty
            alert("Please enter an item name.") //
        }
        else{ // if item name is valid
            var newItemName = $("#new-item-name").val();
            var newItemDate = $("#new-item-date").val();
            
            // if date is not entered, date value becomes "No Due Date"
            if (newItemDate == ""){
                newItemDate = "No Due Date"
            }
            
            addListItem(newItemName, newItemDate);
            
            // -------- CHANGING APPEARANCE OF AN OVERDUE ITEM --------
            if (checkOverdue(newItemDate)){
                $("#list-item").next().children().eq(2).append('<br><p id="overdue-message">Overdue!</p>');;
            }
            // adds new item
            //createListItem(newItemName, newItemDate);
        
            // clears the input fields
            $("#new-item-name").val("");
            $("#new-item-date").val("");   
        }
    
    // -------- CHANGING APPEARANCE OF COMPLETED ITEMS --------
    // on click of the check box change the style to completed or incomplete
    $("#check-box").click(function(){
        
        //console.log($(this).parent().next().find("i").attr("id"));
        //console.log($(this).parent().prev().length);
        
        var elementPos = 1; // the position #item-date element 
        
        // checking if item is a sub-item by checking to see if there is a list element that "exists
        // before the current list element with the check box
        if($(this).parent().prev().length){ 
            elementPos = 2;   // if item is a sub-item, the element position increases by 1
        }
        
        // checking if the item has a priority
        if ($(this).parent().parent().hasClass("priority")){
            // adding a class that indicates the item had priority when incomplete
            $(this).parent().parent().addClass("had-priority");
        }
        
        // checking if the current state is incomplete
        if ($(this).attr("class") == "far fa-check-circle")
        {
            // getting the parent of the parent of the check-box element so the class affects the entire ul
            $(this).parent().parent().addClass("completed");
            $(this).removeClass("far fa-check-circle");
            $(this).addClass("fas fa-check-circle");  
            $(this).attr("id","check-box-completed");
            // removing any priority styles
            $(this).parent().parent().removeClass("priority");
            $(this).parent().next().find("i").removeClass("fas fa-exclamation-circle");
            $(this).parent().next().find("p").remove();
            
            // checking if item is overdue
            if ($(this).parent().siblings().eq(elementPos).find("p").length) {
                $(this).parent().siblings().eq(elementPos).find("p").hide();
            }
        }
        else // item is complete and change classes to incomplete state
        {
            $(this).parent().parent().removeClass("completed");
            $(this).removeClass("fas fa-check-circle"); 
            $(this).addClass("far fa-check-circle");
            $(this).attr("id","check-box");
            
            // checks if item had priority when incomplete
            if ($(this).parent().parent().hasClass("had-priority")){
                // adds priority class
                $(this).parent().parent().removeClass("had-priority");
                $(this).parent().parent().addClass("priority");
                // re-adding priority styles
                $(this).parent().parent().addClass("priority");
                $(this).parent().next().find("i").addClass("fas fa-exclamation-circle");
                $(this).parent().next().find("i").after("<p>&nbsp;High Priority</p>")
            }
            
            // checking if item is overdue
            if ($(this).parent().siblings().eq(elementPos).find("p").length) {
                $(this).parent().siblings().eq(elementPos).find("p").show();
            }
        }
        
    });
    
    // -------- DELETING AN ITEM --------
    // on click of the "Delete Item" dropdown menu option
    $("#delete-button").click(function(){
        $(this).parent().parent().parent().parent().next().remove();
        $(this).parent().parent().parent().parent().remove();
    });

    // -------- ASSIGNING PRIORITY TO AN ITEM --------
    // on click of the "Make Item Priority" dropdown menu option
    $("#priority-button").click(function(){
        
        // checks if item is marked as completed by traversing element to get the ul element and checking
        // if it has a "completed" class
        if($(this).parent().parent().parent().parent().hasClass("completed")){
            // prevents user from assigning priority an item while it is marked as "completed"
            alert("Please mark the item as incomplete before changing the priority.");
            return; // exits the function
        }
        
        // debugging
        //console.log($(this).parent().parent().parent().parent().attr("class"));
        //console.log($(this).parent().parent().parent().siblings().eq(1).find("i").attr("id"));
        
        var elementPos = 1; // the position #item-name element 
        
        if($(this).next().text() == "Promote Sub-Item"){ // if item is a sub-item
            elementPos = 2;   // if item is a sub-item, the element position increases by 1
        }
        
        // checks if item is assigned a priority
        if ($(this).text() == "Make Item Priority") // if no priority is assigned
        {
            // traversing the elements to get to the ul element and adding the "priority class"
            $(this).parent().parent().parent().parent().addClass("priority");

            // transversing the elements to add icon class next to the item name
            $(this).parent().parent().parent().siblings().eq(elementPos).find("i").addClass("fas fa-exclamation-circle");
            $(this).parent().parent().parent().siblings().eq(elementPos).find("i").after("<p>&nbsp;High Priority</p>");    
            
            // changes the text on the dropdown menu
            $(this).text("Remove Priority");
        }
        else // item is already a priority item
        {
            // removes priority style from ul element
            $(this).parent().parent().parent().parent().removeClass("priority");
            
            $(this).parent().parent().parent().siblings().eq(elementPos).find("i").removeClass("fas fa-exclamation-circle"); 
            $(this).parent().parent().parent().siblings().eq(elementPos).find("p").remove();    
            
            // changes the text on the dropdown menu
            $(this).text("Make Item Priority");
        }
        
    });
    
    // -------- CHANGE ITEM TO SUB-ITEM --------
    // on click of the "Make Sub-Item" dropdown menu option
    $("#sub-item-button").click(function(){
        
        // debugging
        //console.log ($(this).parent().parent().parent().siblings().eq(0).attr("id"));
        //console.log ($(this).parent().parent().parent().siblings().eq(1).attr("class"));
        
        // checking if the item is a sub-item
        if ($(this).text() == "Make Sub-Item"){ // if not a sub-item
            // changes the grid size of the #item-name element to accomodate for a new column
            $(this).parent().parent().parent().siblings().eq(1).removeClass("col-5 col-md-6");
            $(this).parent().parent().parent().siblings().eq(1).addClass("col-4 col-md-5");
            // adds a new list element to create an indent
            $(this).parent().parent().parent().parent().prepend('<li class="col-1" id="sub-indent"></li>'); 
            
            // changes the text on the dropdown menu
            $(this).text("Promote Sub-Item");
        }
        else { // if item is a sub-item
            // removes list element that created an indent
            $(this).parent().parent().parent().siblings().eq(0).remove();
            // changes the grid size of #item-name element to original size
            $(this).parent().parent().parent().siblings().eq(1).removeClass("col-4 col-md-5");
            $(this).parent().parent().parent().siblings().eq(1).addClass("col-5 col-md-6");
            
            // changes the text on the dropdown menu
            $(this).text("Make Sub-Item");
        }
        
    });
        
    });
    
    // -------- CHECK OVERDUE FUNCTION --------
    // takes a date string object and returns true if overdue and false if not
    function checkOverdue(date){
        
        if (date == "No Due Date"){ // if there is no due date
            return false; // item is not overdue
        }
        else{
            var dueDate = new Date(date); // creating date object from due date
            var currentDate = new Date(); // creating date object from current date
            //console.log(dueDate);
            //console.log(currentDate);
            if (dueDate > currentDate){ // if due date is "greater than" the current date
                return false; // item is not overdue
            }
            else // if due date is "less than" the current date
            {
                return true; // item is overdue
            }
        }
    }
    
    // -------- ADD LIST ITEM FUNCTION --------
    function addListItem(name, date){
        // I am essentially taking the "LIST ITEM TEMPLATE" from index.html and
        // putting it all together as a string. I split certain elements into chunks
        // just so it would be easier for me handle.
        var checkBox ='<li class="col-1"><i class="far fa-check-circle" id="check-box"></i></li>';
        var itemName = '<li class="col-5 col-md-6" id="item-name">'+ name +'<br> <i id="priority-icon"></i> </li>';
        var itemDate = '<li class="col-3" id="item-date">'+ date +'</li>';
        var button = '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">edit</button>';
        var dropDown = '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton"><a class="dropdown-item" href="#" id="priority-button">Make Item Priority</a><a class="dropdown-item" href="#" id="sub-item-button">Make Sub-Item</a><div class="dropdown-divider"></div><a class="dropdown-item" href="#" id="delete-button">Delete Item</a></div>';
        var editDropDown = '<li class="col-3 col-md-2"><div class="dropdown float-right">' + button + dropDown + '</div></li>';
            
        // adding each piece of HTML into the document
        $("#list-item").after('<ul class="row mb-15">' + checkBox + itemName + itemDate + editDropDown + '</ul> <hr>');
            
    }
    
    // -------- CHANGE LIST TITLE FUNCTION --------
    // changes the display of the list title
    function changeListTitle(newTitle){
        if (newTitle == ""){
            newTitle = "Untitled List";
        }
       $("#list-title").text(newTitle); 
    }
            
});