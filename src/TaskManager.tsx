import useStateRef from 'react-usestateref'
import TaskList from './Tasklist.tsx'
import TaskSearch from './TaskSearch'

export default function TaskManager() {
    const [searchValue, setSearchValue] = useStateRef('')
    const [searchType, setSearchType] = useStateRef<'name' | 'tag'>('name')
    return(
        <>
        {`Searching by ${searchType}`}
        <TaskSearch value={searchValue} onChange={setSearchValue} setSearchType={setSearchType}/>
        <TaskList searchType={searchType} searchValue={searchValue} />
        </>
    )
}