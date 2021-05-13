import React, { useState, useEffect } from 'react';
import './MSLearnStyle.scss';
import Module from './module';

const cache = {};

const useFetch = url => {
    const [status, setStatus] = useState('idle');
    const [modules, setModules] = useState();
    const [learningpaths, setPaths] = useState();
    useEffect(() => {
        if (!url) return;
        const fetchData = async () => {
            setStatus('fetching');
            if(cache[url]){
                const data = cache[url];
                setModules(data.modules);
                setPaths(data.learningPaths);
                setStatus('fetched');
            }
            else{
                const response = await fetch(url);
                const data = await response.json();
                cache[url] = data;//this will save data to the cache
                setModules(data.modules);
                setPaths(data.learningPaths);
                setStatus('fetched');
            }
        };

        fetchData();
    }, [url]);

    return { status, modules, learningpaths };
};

export default function MSLearnContainer(){

    const url = 'https://docs.microsoft.com/api/learn/catalog/';
    const { status, modules, learningpaths } = useFetch(url);//Data is stored in cache once its been pulled.
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const[data2, setData2] = useState([]);
    const [resultQuery, setResultQuery] = useState('');
    const handleChange = event => {
        setSearch(event.target.value);
    };

    const callSearchFunction = e => {
        e.preventDefault();
        setResultQuery(search);
        setData(modules.filter(module => 
            module.summary.toLowerCase().includes(search.toLowerCase()) ||
            module.title.toLowerCase().includes(search.toLowerCase())
        )
        );

        setData2(learningpaths.filter(lp => 
            lp.summary.toLowerCase().includes(search.toLowerCase()) ||
            lp.title.toLowerCase().includes(search.toLowerCase())
        )
        );
    };

    const resultSection = resultQuery ? <div className='modulecontainer'>
        {data.length === 0 && data2.length===0 ? <p>No results for {resultQuery}</p> : <p>Showing results for {resultQuery}</p>}
        {data &&
                data.slice(0,20).map(module => {
                    return(
                        <a key={module.url} href={module.url} target="_blank" rel="noreferrer" className='module'>
                            <Module name={module.title} type='Module' description={module.summary}/>
                        </a>
                    );
                })
        }
        {data2 &&
                data2.slice(0,20).map(module => {
                    return(
                        <a key={module.url} href={module.url} target="_blank" rel="noreferrer" className='module'>
                            <Module name={module.title} type='Learning Pathway' description={module.summary}/>
                        </a>
                    );
                })
        }
    </div>
        : null;

    //Do not load till the data is received from the API
    if(status!='fetched'){
        return <p>Loading modules...</p>;
    }
    //TODO Make a toggle to allow user to search for modules and learningpaths separately (useState probably)
    return(
        <>
            <p className='microsoft_learn'>Search for help via Microsoft</p>
            <div className='modules'>
                <div className='searchContainer'>
                    <form onSubmit={callSearchFunction}>
                        <input
                            value={search}
                            onChange={handleChange}
                            type="text"
                            className='inputbar'
                        />
                        <input className='searchbtn' type="submit" value="SEARCH" />
                    </form>
                </div>
                <div className='modulecontainer'>
                    {resultSection}
                </div>
            </div>
        </>
    );
}