export function createShortCard(divClass , arrayOfTasks , i , parentOfDiv){
    const div = document.createElement("div");
    const containerForShortcardElements = document.createElement("div");
    
    const checkBox = document.createElement("input");
    const title = document.createElement("p");
    const descriptionBtn = document.createElement("button");
    const priority = document.createElement("p");
    const dueDate = document.createElement("p");
    const editTask = document.createElement("button");
    const deleteTask = document.createElement("button");

    div.classList.add(divClass);  
    containerForShortcardElements.classList.add("container");
    descriptionBtn.classList.add("showDescription");
    editTask.classList.add("editTask");
    deleteTask.classList.add("deleteTask");

    div.id = arrayOfTasks[i].id;

    checkBox.setAttribute("type" , "checkbox");
    checkBox.id = `taskStatus${arrayOfTasks[i].id}` ;
    title.textContent = arrayOfTasks[i].title ;
    descriptionBtn.textContent = "More" ;
    priority.textContent = `Priority: ${arrayOfTasks[i].priority}`;
    dueDate.textContent = `Due-Date: ${arrayOfTasks[i].dueDate}`;
    editTask.textContent = "Edit" ;
    deleteTask.textContent = "Delete" ;

    parentOfDiv.appendChild(div);

    div.appendChild(containerForShortcardElements);

    containerForShortcardElements.appendChild(checkBox);
    containerForShortcardElements.appendChild(title);
    containerForShortcardElements.appendChild(descriptionBtn);
    containerForShortcardElements.appendChild(priority);
    containerForShortcardElements.appendChild(dueDate);
    containerForShortcardElements.appendChild(editTask);
    containerForShortcardElements.appendChild(deleteTask);

}