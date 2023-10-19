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

export default function TaskList() {
  const [taskList, tasks] = useListState<TaskType>();
  const [_taskId, setTaskId, ref] = useState<number>(0)
  const [tagsMap, tagsMapAction] = useMap<string,Array<number>>()
  const getNewTaskId = ():number => {
    setTaskId(c => c+1)
    return(ref.current-1)
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
    editTag: (taskIndex:number, tagIndex:number, tagName:string, tagColor:string) => {

      // I think I have to split this edit tag into 2 functions
      // one edits the tag name in the tasks list using tasks.setItemProp
      // the other one submits the change into the tagsMap which is invoked on new name/color submit

      // plus fix the console error

      var curTag=taskList[taskIndex].tags[tagIndex]
      console.log(tagIndex)
      
      if (tagName!=curTag) {
        var curTagArr=tagsMap.get(curTag)
        console.log(curTagArr)
        if (curTagArr!=undefined) {
          tagsMapAction.set(curTag, curTagArr.filter((_v, curIndex) => curIndex!=taskIndex))
        }
        tagsMapAction.set(tagName, [...(tagsMap.get(tagName) ?? []), taskIndex])
        tasks.setItemProp(taskIndex, `tags`, taskList[taskIndex].tags.map((_v, curIndex) => curIndex==tagIndex ? tagName : _v))
      }
    },
    newTag: (taskIndex:number) => {
      tasks.setItemProp(taskIndex, 'tags', [...taskList[taskIndex].tags, "New tag"])
      tagsMapAction.set("New tag", [...(tagsMap.get("New tag") ?? []), taskIndex])
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
              {taskList.map((task, taskIndex) => 
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
                        newTag={taskFunctions.newTag}
                        
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