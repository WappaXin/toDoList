import { toDoListLogic } from "./module1.js";
import { createShortCard } from "./shortCardForTask.js";
import { storeData , getData } from "./localStorage.js";

export function firstInstance(){
    
    const firstInstanceOfData = toDoListLogic();
    
    // Check if the local storage has any data
    // If it has then load that data into the firstInstance
    // Else start fresh
    const checkData = getData('dataCheck') ;
    if( checkData ){
        const allToDoItemsFromLS = JSON.parse( getData( 'allToDoItems' ) );
        const allProjectsFromLS = JSON.parse( getData('allProjects') );
        const highestIdTillNow = JSON.parse( getData('highestId') );

        for(let i = 0 ; i < allToDoItemsFromLS.length ; i++ ){
            firstInstanceOfData.pushDataInAllToDoItems( allToDoItemsFromLS[i] );
        }

        for(let project in allProjectsFromLS){
            firstInstanceOfData.pushDataInAllProjects( project , allProjectsFromLS[project] );
        }

        firstInstanceOfData.changeIdToHighest(highestIdTillNow) ;
    }

    // LC
    storeData( 'dataCheck' , "dataIsPresent" );

    function addToLocalStorage(){
        storeData( 'allToDoItems' , JSON.stringify(firstInstanceOfData.getAllToDoItems()) );
        storeData( 'allProjects' , JSON.stringify(firstInstanceOfData.getAllProjects()) );
    }

    addToLocalStorage();

    const addProjectBtn = document.querySelector(".addProjectBtn");
    const enterProjectNameDiv = document.querySelector(".enterProjectNameDiv");
    const displayProjectName = document.querySelector(".displayingProjectName");
    const rightDisplay = document.querySelector(".display");

    addProjectBtn.addEventListener("click" , addProject);

    function addProject(){
    
        addProjectBtn.disabled = true;

        enterProjectNameDiv.style.borderBottom = "5px solid white" ;
        
        // Form
        const projectForm = document.createElement("form");
        const projectLabel = document.createElement("label");
        const projectInput = document.createElement("input");
        const buttonsDiv = document.createElement("div");
        const projectNameSubmitButton = document.createElement("input");
        const projectNameCancelButton = document.createElement("button");
        
        projectLabel.setAttribute("for" , "projectName");
        projectLabel.textContent = "Project Name:";
    
        projectInput.setAttribute("type" , "text");
        projectInput.id = "projectName" ;
        projectInput.setAttribute("name" , "ProjectName");
    
        projectNameSubmitButton.setAttribute("type" , "submit");
        projectNameSubmitButton.setAttribute("value" , "Enter");
        projectNameSubmitButton.id = "projectNameSubmitButton" ;
    
        projectNameCancelButton.id = "projectNameCancelButton" ;
        projectNameCancelButton.textContent = "Cancel" ;

        projectForm.appendChild(projectLabel);
        projectForm.appendChild(projectInput);
        projectForm.appendChild(buttonsDiv);
        buttonsDiv.appendChild(projectNameSubmitButton);
        buttonsDiv.appendChild(projectNameCancelButton);
        enterProjectNameDiv.appendChild(projectForm);
    
        projectNameSubmitButton.addEventListener("click" , submitProjectName);
    
        projectNameCancelButton.addEventListener("click" , cancelProjectName);

        function submitProjectName(event) {
            event.preventDefault();
            
            if(projectInput.value == ""){
                alert("Please enter a project name!");
                return;
            }
    
            firstInstanceOfData.createProject(projectInput.value);
            // LS
            addToLocalStorage();
    
            enterProjectNameDiv.replaceChildren();
            enterProjectNameDiv.style.borderBottom = "5px solid black" ;
    
            updateDisplayProjectsinSideBar();

            addProjectBtn.disabled = false;
        }

        function cancelProjectName(event){
            event.preventDefault();
            enterProjectNameDiv.replaceChildren();
            enterProjectNameDiv.style.borderBottom = "5px solid black" ;
    
            addProjectBtn.disabled = false;
        }
    }
    
    const projectsInSideBar = document.querySelector(".projectsDisplay");
    
    updateDisplayProjectsinSideBar();
    
    function updateDisplayProjectsinSideBar(){

        let projectIdCount = 0;
        const projectIdCounter = function(){ projectIdCount++ ;  return projectIdCount; } ;

        const allProjectsObject = firstInstanceOfData.getAllProjects();

        projectsInSideBar.replaceChildren();
    
        let projectNames = [];
    
        for(let project in allProjectsObject){
            projectNames.push(project);
        }
    
        // we want to display only last 4 projects in the side bar
        // so we try to store their names in this array
        let projectNamesInSideBar = [];
    
        if(projectNames.length === 0){return}
        
        // since we are extracting last 4 project names from the reverse order
        // the latest project created will be first after we push it in the prjectNamesInsidebar array 
        if(projectNames.length < 5){
            for(let i = projectNames.length - 1 ; i >= 0 ; i-- ){
                projectNamesInSideBar.push(projectNames[i]);
            }
        }
        
        if(projectNames.length > 4){
            for(let i = projectNames.length - 1 ; i > projectNames.length - 5 ; i--){
                projectNamesInSideBar.push(projectNames[i]);
            }
        }
        
        function createProjectButton(index){
            const projectBtn = document.createElement("button");
            projectBtn.classList.add("projectInSideBar");
            projectBtn.id = `${projectIdCounter()}`;
            projectBtn.textContent = `${projectNamesInSideBar[index]}`;
            projectsInSideBar.appendChild(projectBtn);
        }
    
        for( let i = 0 ; i < projectNamesInSideBar.length ; i++){
            createProjectButton(i);
    
        }

        if(rightDisplay.id === "displayingAllProjects"){
            displayAllProjects();
        }
        
    }

    projectsInSideBar.addEventListener("click" , (event) => {
        openProjectInDisplay(event)  
    } );

    function openProjectInDisplay(event){
        if(event.target.classList.contains("projectInSideBar")){
            displayAllTasksInProject(event.target.textContent);
            displayProjectName.textContent = event.target.textContent;
        }
    }
    
    const addTaskBtn = document.querySelector(".addTask");
    addTaskBtn.addEventListener("click" , showTaskForm);

    const addTaskModal = document.querySelector(".addTaskModal");
    const closeModal = document.querySelector("#closeModal");
    const submitAddTaskBtn = document.querySelector("#submitTaskModal");
    const taskForm = document.querySelector("#taskForm");

    closeModal.addEventListener("click" , closeTaskForm);
    submitAddTaskBtn.addEventListener("click" , submitNewTask);

    function showTaskForm(){
        if(enterProjectNameDiv.textContent !== ""){
            alert("Fill in the project first");
            return;
        }

        taskForm.reset();
        addTaskModal.showModal();
    }

    function closeTaskForm(event){
        event.preventDefault();
        taskForm.reset();
        addTaskModal.close();
    }
    
    const titleInput = document.querySelector("#title");
    const descriptionValue = document.querySelector("#description");
    const dueDateInput = document.querySelector("#dueDate");
    const priorityInput = document.querySelector("#priority");

    let highestIdValue = -1;

    function highestId(givenValue){
        if(givenValue > highestIdValue){
            highestIdValue = givenValue;
        }

        storeData('highestId' , highestIdValue );
    }

    let editTaskStatus = "nothing" ;
    let idOfModifyingTask = "" ;

    function changeEditTaskStatus(idOfSelectedTask){
        idOfModifyingTask = idOfSelectedTask ;
        return editTaskStatus = "modifyingTask" ; 
    }

    function deleteUnmodifiedTaskAfterEdit(){
        if(editTaskStatus === "modifyingTask"){
            deleteTask(idOfModifyingTask);
            editTaskStatus = "nothing" ;
        }
    }

    function submitNewTask(event){
        event.preventDefault();


        let title = titleInput.value;
        let description = descriptionValue.value;
        let dueDate = dueDateInput.value;
        let priority = priorityInput.value;

        // if the right display contains a project then add it to the project otherwise
        // add it to the all items
        if(rightDisplay.id === "displayingProject"){
            let projectName = rightDisplay.dataset.projectName;
            firstInstanceOfData.addToDoItemToProject(projectName , title , description , dueDate , priority );
            deleteUnmodifiedTaskAfterEdit();
            const latestTaskInProject = firstInstanceOfData.getAllToDoItemsInAProject(projectName);
            console.log(latestTaskInProject);
            console.log(latestTaskInProject[latestTaskInProject.length - 1].id);
            highestId(latestTaskInProject[latestTaskInProject.length - 1].id);
            // LS
            addToLocalStorage();
            displayAllTasksInProject(projectName);
        }else {
            firstInstanceOfData.addToDoItemToAll(title , description , dueDate , priority );
            deleteUnmodifiedTaskAfterEdit();
            const latestTask = firstInstanceOfData.getAllToDoItems();
            highestId(latestTask[latestTask.length - 1].id);
            // LS
            addToLocalStorage();
            displayAllTasks();
        }
        
        taskForm.reset();

        addTaskModal.close();

        // Try to erase the previously filled to-do task in the form
    }

    const allTasksBtn = document.querySelector(".allTasks");

    let rightDisplayStatus = "";

    function getRightDisplayStatus() {
        return rightDisplayStatus;
    }

    allTasksBtn.addEventListener("click" , displayAllTasks);

    function displayAllTasks(){
        addTaskBtn.disabled = false;
        displayProjectName.textContent = "" ;
        displayProjectName.style.height = "0%" ;

        rightDisplay.replaceChildren();
        const allTasks = firstInstanceOfData.getAllToDoItems();

        rightDisplay.id = "displayingAllTasks" ;
        rightDisplayStatus = "displayingAllTasks" ;

        for(let i = allTasks.length - 1; i >= 0 ; i--){
           
            createShortCard("shortCardInAllTasks" , allTasks , i , rightDisplay);
            allTasksBtn.disabled = true;

        }
        
    }

    const allProjects = document.querySelector(".projects");

    allProjects.addEventListener("click" , displayAllProjects);

    function displayAllProjects(){
        addTaskBtn.disabled = true;
        displayProjectName.textContent = "" ;
        displayProjectName.style.height = "0%" ;
        rightDisplay.id = "displayingAllProjects" ;
        rightDisplayStatus = "displayingAllProjects" ;
        rightDisplay.replaceChildren();

        if(rightDisplay.id !== "displayingAllTasks"){
            allTasksBtn.disabled = false;
        }

        const allProjectNames = Object.keys(firstInstanceOfData.getAllProjects());

        for(let i = allProjectNames.length - 1 ; i >= 0 ; i--){
            let projectBtn = document.createElement("button");
            projectBtn.classList.add("projectInRightDisplay");
            projectBtn.textContent = allProjectNames[i];

            rightDisplay.appendChild(projectBtn);
        }

    }

    rightDisplay.addEventListener("click" , (event) => { 
        
        if(event.target.classList.contains("projectInRightDisplay")){
            const projectName = event.target.textContent;

            displayProjectName.textContent = "" ;
            displayProjectName.textContent = projectName;
            if(displayProjectName.textContent !== "" ){
                
                displayProjectName.style.height = "5%";
                
            }
    
            displayAllTasksInProject(projectName);
        }
    })

    function displayAllTasksInProject(projectName){
        addTaskBtn.disabled = false ;
        rightDisplay.id = "displayingProject" ;
        rightDisplayStatus = "displayingProject" ;
        rightDisplay.dataset.projectName = "" ;
        rightDisplay.dataset.projectName = `${projectName}` ;

        rightDisplay.replaceChildren();
        
        const allTasksInAProject = firstInstanceOfData.getAllToDoItemsInAProject(projectName);
        console.log(allTasksInAProject);

        if(allTasksInAProject === undefined){
            rightDisplay.textContent = "Empty project" ;
            console.log("Deleted last task in a project!")
            return;
        }

        if(allTasksInAProject.length > 0 ){
            for(let i = allTasksInAProject.length - 1 ; i >= 0 ; i--){
                createShortCard("shortCardInAProject" , allTasksInAProject , i , rightDisplay);
    
            }
        }else if(allTasksInAProject.length === 0 ){
            rightDisplay.textContent = "Empty project" ;
            
        }

    }

    rightDisplay.addEventListener("click" , (event) => {
        if( event.target.classList.contains("editTask")){
            showTaskForm();
            taskForm.reset();
            
            const idOfSelectedTask = event.target.parentNode.parentNode.id ;
            changeEditTaskStatus(idOfSelectedTask);

            const selectedTask = firstInstanceOfData.getAllToDoItems().filter((element) => {
                return element.id == idOfSelectedTask;
            })[0];

            titleInput.value = selectedTask.title;
            descriptionValue.value = selectedTask.description;
            dueDateInput.value = selectedTask.dueDate;
            priorityInput.value = selectedTask.priority;

        }

    })

    rightDisplay.addEventListener("click" , (event) => {
        if(event.target.classList.contains("deleteTask")){
            const idOfSelectedTask = event.target.parentNode.parentNode.id ;

            const projectName = event.target.parentNode.parentNode.parentNode.dataset.projectName;
            deleteTask(idOfSelectedTask , projectName);
        }
    });


    function deleteTask(idOfSelectedTask , projectName){
        
        firstInstanceOfData.removeToDoItem(idOfSelectedTask);
        addToLocalStorage();

        if(getRightDisplayStatus() === "displayingAllTasks"){
            displayAllTasks();
        }else if(getRightDisplayStatus() === "displayingProject"){
            displayAllTasksInProject(projectName);
        }
            
    }

    rightDisplay.addEventListener("click" , (event) => {
        if(event.target.classList.contains("showDescription")){

            const idOfSelectedTask = event.target.parentNode.parentNode.id;
            const selectedShortCard = event.target.parentNode.parentNode;
            const descriptionDiv = document.createElement("div");

            if(selectedShortCard.classList.contains("showingDescription") === false){

                selectedShortCard.appendChild(descriptionDiv);
                descriptionDiv.classList.add("descriptionOfTheTask");

                selectedShortCard.classList.add("showingDescription");
    
                const descriptionOfSelectedShortCard = firstInstanceOfData.getAllToDoItems().filter((element , index) => {
                    return element.id == idOfSelectedTask;
                })[0].description;
    
                descriptionDiv.textContent = descriptionOfSelectedShortCard;
                return;
            } else if(selectedShortCard.classList.contains("showingDescription") === true){
                selectedShortCard.removeChild(selectedShortCard.children[1]);
                descriptionDiv.classList.remove("descriptionOfTheTask");

                selectedShortCard.classList.remove("showingDescription");
                return;
            }
        }
        }

    )

    rightDisplay.addEventListener("change" , (event) => {
        taskStatusChange(event);   
    });

    function taskStatusChange(event){

        const selectedTask = event.target.parentNode.parentNode;
        if(selectedTask.classList.contains("completed") === false){
            selectedTask.classList.add("completed");
        }else if(selectedTask.classList.contains("completed") === true){
            selectedTask.classList.remove("completed");
        }
    }


    
}