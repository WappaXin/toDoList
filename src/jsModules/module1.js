export function toDoListLogic(){

    const allToDoItems = [];

    const allProjects = {};

    class toDOItem {
    constructor(title, description, dueDate, priority, id){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = "Pending" ;
        this.id = id;
        }
    }

    const createProject = (projectName) => {
        for(let project in allProjects){
            if(project === projectName){
                alert("There is a project with that name already.");
                return;
            }
        }
        
        allProjects[projectName] = [];
        
    }

    let idValue = 0;

    const changeIdToHighest = (highestId) => { idValue = highestId ;}

    const idCount = () => { return ++idValue ;}

    const createToDoItem = (title, description, dueDate, priority) => {

        return(new toDOItem(title, description, dueDate, priority, idCount()));
    
    }

    const isInAllProject = (projectName) => {
        for(let project in allProjects){
            if(project === projectName){
                return true;
            }
        }
    }

    const addToDoItemToAll = (title, description, dueDate, priority) => {allToDoItems.push(createToDoItem(title, description, dueDate, priority));}

    const addToDoItemToProject = (arrayName ,title, description, dueDate, priority) => {

        if( isInAllProject(arrayName) === true ){

            allProjects[arrayName].push(createToDoItem(title, description, dueDate, priority));
            // we are not using addToDoItemToAll function besause it assigns a new id everytime we create a toDoItem
            // also writing arrayname.legth gives us string value and not array length as arrayName is by itself not an array in the context of this function
            allToDoItems.push(allProjects[arrayName][allProjects[arrayName].length - 1]);
        }
    }

    const removeToDoItem = (idValue) => {

        allToDoItems.forEach((element, index) => {
            if(element.id == idValue){
                allToDoItems.splice(index, 1);
            }
        } )

        for(let project in allProjects){
            allProjects[project].forEach((element, index) => {
                if(element.id == idValue){
                    allProjects[project].splice(index, 1);
                }
            })
        }
        
    }

    const removeProject = (projectName) => {
        for( let i = allProjects[projectName].length - 1 ; i >= 0 ; i-- ){
            let idValue = allProjects[projectName][i].id;
            removeToDoItem(idValue);
        }

        delete allProjects[projectName];
    }

    const getAllToDoItems = () => {return allToDoItems};

    const getAllProjects = () => {return allProjects};

    const getAllToDoItemsInAProject = (projectName) => { 
        for( let project in allProjects){
            if(project === projectName){
                console.log(project);
                console.log(projectName);
                console.log(allProjects[projectName]);
                return allProjects[projectName];
            }
        }
     }

    const pushDataInAllToDoItems = (element) => { allToDoItems.push(element) } ;

    const pushDataInAllProjects = ( projectName , project ) => { allProjects[projectName] = project } ;

    return {createProject,
            addToDoItemToAll,
            addToDoItemToProject ,
            removeToDoItem,
            removeProject,
            getAllToDoItems,
            getAllProjects,
            getAllToDoItemsInAProject,
            pushDataInAllToDoItems,
            pushDataInAllProjects,
            changeIdToHighest
            };
}