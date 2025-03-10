export const ResultBox = ({ result }) => {
	const handleClick = () => {
		console.log('clicked!');
	};
	return (
		<div
			className="hover:cursor-pointer hover:bg-amber-600"
			onClick={handleClick}
		>{`${result.words[0].fullWord}: ${result.score}`}</div>
	);
};
