import { UnstyledButton } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import classes from './styles/appStyles.module.css';
import useState from 'react-usestateref';
import Task from './components/Task'
import { useMap } from 'usehooks-ts';


export class TaskClass {
  title: string;
  desc: string;
  completed: boolean;
  id: string;
  tags: string[]
  constructor(id:number) {
    this.id = id.toString();
    this.title='New task ✨'; 
    this.desc='Task description.';
    this.completed=false;
    this.tags=[]
  }
}

export type TaskType = InstanceType<typeof TaskClass>

export default function TaskList({searchType, searchValue} : {searchType: string, searchValue: string}) {
  const [taskList, tasks] = useListState<TaskType>();
  const [_taskId, setTaskId, ref] = useState<number>(0)
  const [tagsMap, tagsMapAction] = useMap<string,Array<number>>()
  const [rawTag, setRawTag] = useState<string>('')
  const getNewTaskId = ():number => {
    setTaskId(c => c+1)
    return(ref.current-1)
  }

  const isFiltered = (taskTitle:string, taskTags:string[]) => {
    if (searchValue.length==0) { return(false) }
    if (searchType=='name') { return(taskTitle.toLowerCase().includes(searchValue.toLowerCase())==false) }
    for(var i = 0; i < taskTags.length; i++) {
      if (taskTags[i].toLowerCase().includes(searchValue.toLowerCase())==true) {
        return(false)
      }
    }
    return(true)
  }

  const taskFunctions = {
    createNew: () => tasks.append(new TaskClass(getNewTaskId())),
    completeIndex: (taskIndex:number) => tasks.setItemProp(taskIndex, 'completed', !taskList[taskIndex].completed),
    deleteIndex: (taskIndex:number) => {

      var c, curTagsArr;
      for(let i = 0; i < taskList[taskIndex].tags.length; i++) {
        c=taskList[taskIndex].tags[i]
        curTagsArr=tagsMap.get(c)
        if (curTagsArr==undefined) { continue; }
        tagsMapAction.set(c, curTagsArr.filter((curIndex) => curIndex!=taskIndex))
      }

      tasks.remove(taskIndex)
      
    },
    editIndex: (taskIndex:number, taskProp:keyof TaskClass, newValue:any) => {
      tasks.setItemProp(taskIndex, taskProp, newValue)
    },
    submitTagChange: (taskIndex:number, tagName:string) => {
      if (rawTag!=tagName && rawTag!="") {
        var curTagArr=tagsMap.get(rawTag)
        if (curTagArr!=undefined) {
          if (curTagArr.length==1) { 
            tagsMapAction.remove(rawTag)
          }else {
            tagsMapAction.set(rawTag, curTagArr.filter((_v, curIndex) => curIndex!=taskIndex))
          }
        }
        if (tagName!="") {
          tagsMapAction.set(tagName, [...(tagsMap.get(tagName) ?? []), taskIndex])
        }
      }
      setRawTag('')
    },
    editTag: (taskIndex:number, tagIndex:number, tagName:string) => {
      if (rawTag=="") { setRawTag(taskList[taskIndex].tags[tagIndex]) }
      tasks.setItemProp(taskIndex, `tags`, taskList[taskIndex].tags.map((_v, curIndex) => curIndex==tagIndex ? tagName : _v))
    },
    newTag: (taskIndex:number) => {
      tasks.setItemProp(taskIndex, 'tags', [...taskList[taskIndex].tags, "New tag"])
      tagsMapAction.set("new tag", [...(tagsMap.get("New tag") ?? []), taskIndex])
    },
    deleteEmptyTags: (taskIndex:number) => {
      tasks.setItemProp(taskIndex, `tags`, taskList[taskIndex].tags.filter(curTag => curTag!=""))
    }
  }
  return (
    <div className={classes.taskListWrapper}>
      <DragDropContext
        onDragEnd={({ destination, source }) => tasks.reorder({ from: source.index, to: destination?.index ?? source.index})}
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {taskList.map((task, taskIndex) => isFiltered(task.title, task.tags) ? null :
                <Draggable key={task.id} index={taskIndex} draggableId={task.id}>
                  {(provided, snapshot) =>
                    <div
                      className={classes.taskWrapper}
                      data-is-dragging={snapshot.isDragging ? true : null}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      style={snapshot.isDropAnimating ?
                              {...provided.draggableProps.style, transitionDuration: '0.1s'} :
                              provided.draggableProps.style}
                    >
                      <Task
                        data={task}
                        listIndex={taskIndex}
                        createNew={taskFunctions.createNew}
                        completeIndex={taskFunctions.completeIndex}
                        deleteIndex={taskFunctions.deleteIndex}
                        editIndex={taskFunctions.editIndex}
                        editTag={taskFunctions.editTag}
                        submitTagChange={taskFunctions.submitTagChange}
                        newTag={taskFunctions.newTag}
                        deleteEmptyTags={taskFunctions.deleteEmptyTags}
                        
                        />
                    </div>
                  }
              </Draggable>
            )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <UnstyledButton onClick={taskFunctions.createNew} className={classes.addNewButton} component='img' src='./icons/plus.svg' />
    </div>
  );
}