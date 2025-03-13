import "./index.css";
import "./cssForModules/projectInLeft.css";
import "./cssForModules/addTaskModal.css";
import "./cssForModules/shortCardInAllTasks.css";
import "./cssForModules/displayingAllProjects.css";

import {consoleLogTest} from "./jsModules/consoleLogTest" ;
import { firstInstance } from "./jsModules/firstInstance.js";

consoleLogTest();

firstInstance();
// const addProjectBtn = document.querySelector(".addProjectBtn");
// addProjectBtn.addEventListener("click" , addProject);
