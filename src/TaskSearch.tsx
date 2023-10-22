export default function TaskSearch({value, onChange, setSearchType}:{value:string, onChange:(newValue:string) => void, setSearchType:(type: 'name' | 'tag') => void}) {
    return(
        <div>
            <div>
                <button onClick={() => setSearchType('name')}>Name</button>
                <button onClick={() => setSearchType('tag')}>Tag</button>
            </div>
            <input value={value} onChange={(e) => onChange(e.currentTarget.value)}/>
        </div>
    )
}