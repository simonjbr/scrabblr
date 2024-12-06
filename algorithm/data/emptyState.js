const createEmptyState = () => {
	return Array.from({length: 15}, () => Array.from({length: 15}, () => ''));
}

export default createEmptyState;