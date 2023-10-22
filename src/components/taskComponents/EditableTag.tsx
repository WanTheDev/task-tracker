import classes from '../../styles/taskTextStyles.module.css'

export default function EditableTag({tag, editTag, tagOnChange}:{tag:string, editTag:() => void, tagOnChange: (newTag:string) => void}) {
    return(
    <div className={classes.taskTag} onClick={() => {editTag()}}>
        <input onInput={(e) => {tagOnChange(e.currentTarget.value)}} className={classes.taskTagInput} value={tag.toString()} />
    </div>
    )
}