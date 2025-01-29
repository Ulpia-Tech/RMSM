import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { useActiveFiltersCounter } from '../../../../Context/ActiveFiltersCounterContext/ActiveFiltersCounterContextProvider';
import { useReactTableLibContext } from '../../../../Context/ReactTableLibContext/ReactTableLibContextProvider';

const EntityTypeDropdown = ({ onSelectActiveEntityType }) => {
	const [entityTypeUri, setEntityTypeUri] = useState('');
	const { visibleRowsCollection: visibleRowsCollectionState } = useReactTableLibContext();
	const { activeFiltersCollection: activeFiltersCollectionState } = useActiveFiltersCounter();
	const [objectTypesItemsCollection, setObjectTypesItemsCollection] = useState(visibleRowsCollectionState.filter(item => item.id === '0' || item.id === '1'));
	
	useEffect(() => { 
		if(activeFiltersCollectionState.length === 0) { 
			setEntityTypeUri('');
		}
	}, [activeFiltersCollectionState])

	const handleChange = (event) => {
		setEntityTypeUri(event.target.value);
		onSelectActiveEntityType(event.target.value)
	};
	// console.log(objectTypesItemsCollection);
	return (
		<Box sx={{ width: '375px' }}>
			<FormControl fullWidth >
				<InputLabel sx={{top: '-2px'}} id="select-label">Object type</InputLabel>
				<Select
					labelId="select-label"
					id="demo-simple-select"
					data-testid="object-type-dropdown"
					value={entityTypeUri}
					label="Object type"
					onChange={handleChange}
				>
					{objectTypesItemsCollection.map(item => {
						return (
							<MenuItem sx={{ height: '55px' }}
								key={item.id}
								value={item.original.uri}
								data-testid-specific={`object-type-item-${item.id}`}
								data-testid="object-type-item"
							>
								{item.original.displayName}
							</MenuItem>
						)
					})}
				</Select>
			</FormControl>
		</Box>
	);
}

export default EntityTypeDropdown;