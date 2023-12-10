import React, { useState } from 'react';
import Politicalmap from './PoliticalMap';
import PPoliticalmap from './PPoliticalmap';

function App() {
    const [categoryColorMappings, setCategoryColorMappings] = useState([]);

    const handleCategoryColorMappingsChange = (mappings) => {
        setCategoryColorMappings(mappings);
    };

    return (
        <div>
            <PPoliticalmap onMappingsChange={handleCategoryColorMappingsChange} />
            <Politicalmap categoryColorMappings={categoryColorMappings} />
        </div>
    );
}

export default App;
