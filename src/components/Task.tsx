import useState from 'react-usestateref'
import { getTaskComponents } from '../scripts/getTaskComponents'
import classes from '../styles/taskStyles.module.css'
import ScallableInput from './taskComponents/ScallableInput'
import { UnstyledButton } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import { TaskClass } from '../Tasklist'
import EditableTag from './taskComponents/EditableTag'

const unselectable={className:classes.unselectable}

interface TaskProps {
    data: TaskClass
    listIndex: number
    createNew: () => void;
    completeIndex: (index:number) => void;
    deleteIndex: (index:number) => void;
    editIndex: (index:number, taskProp:keyof TaskClass, newValue:any) => void;
    newTag: (index:number) => void;
    editTag: (taskIndex:number, tagIndex:number, tagName: string, tagColor: string) => void;
}

export default function Task({data, listIndex, completeIndex, deleteIndex, editIndex, newTag, editTag}:TaskProps) {
    const [editingState, setEditState, editRef] = useState<'' | 'tag' | 'title' | 'desc'>('')
    const getDescComps = () => getTaskComponents('desc', data, () => setEditState('desc'))
    const getTitleComps = () => getTaskComponents('title', data, () => setEditState('title'))
    
    const [descDivs, setDescDivs] = useState<any>(getDescComps())
    const [titleDivs, setTitleDivs] = useState<any>(getTitleComps())
    const [editingTag, setEditTag] = useState<number>(-1)
    
    
    const resetEditState = () => {
      if (editRef.current=='desc') {setDescDivs(getDescComps())}
      else if (editRef.current=='title') {setTitleDivs(getTitleComps())}
      setEditState('')
      setEditTag(-1)
    }
    const editTagIndex = (tagIndex:number) => {
        setEditState('tag')
        setEditTag(tagIndex)
    }
    const applyTagChanges = (tagIndex:number, tagName:string, tagColor:string) => {
        resetEditState()
        editTag(listIndex, tagIndex, tagName, tagColor)
    }
    const ref = useClickOutside(resetEditState);
  
    const taskInputProps={
      onChange: (event:any) => editIndex(listIndex, editingState as 'title' | 'desc', (event?.currentTarget.value ?? event?.target.value) || ""),
      ref: ref,
      resetEditState
    }
    
    

    return(
      <>
        <div className={classes.taskLeftSide}>
          <UnstyledButton component='img' src='./icons/trash.svg' {...unselectable} onClick={() => deleteIndex(listIndex)}></UnstyledButton>
          <div className={classes.taskTextWrapper} data-editing-tag={editingState=='tag' ? true : null} data-completed={data.completed ? true : null}>
            {
              editingState=='title' ?
              <ScallableInput {...taskInputProps} type='title' value={data.title}/> :
              titleDivs
            }
            <div className={classes.taskBadgesWrapper} ref={editingState=='tag' ? ref : null}>
                {
                    data.tags.map((curTag, tagIndex) => <EditableTag
                        editing={tagIndex==editingTag}
                        tag={curTag}
                        editTag={() => editTagIndex(tagIndex)}
                        tagOnChange={(newTag:string) => editTag(listIndex, tagIndex, newTag, 'blue')}
                        //deleteTag={() => deleteTagIndex(tagIndex)} // to do later
                        applyChanges={(tagName:string, tagColor:string) => applyTagChanges(tagIndex, tagName, tagColor)}
                        />)
                }
                <UnstyledButton component='img' src={'./icons/plus.svg'} className={classes.addBadgeButton} onClick={() => newTag(listIndex)} />
            </div>
            {
              editingState=='desc' ?
              <ScallableInput {...taskInputProps} type='desc' value={data.desc} /> :
              descDivs
            }
          </div>
        </div>
        <UnstyledButton component='img' src={data.completed ? './icons/checkbox-filled.svg' : './icons/checkbox.svg'} {...unselectable} onClick={() => completeIndex(listIndex)}/>
      </>
    )
  }