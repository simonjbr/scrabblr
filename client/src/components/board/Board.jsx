import { Square } from './Square';
import { WORDFEUD_DEFAULT_BOARD } from '../../lib/constants';
import { useBoardContext } from '../../context/BoardContext';

export const Board = () => {
	const { board } = useBoardContext();

	return (
		<div className="grid gridRows-15 border-2 border-emerald-400 w-fit">
			{board.map((row, rowIndex) => (
				<div key={rowIndex} className="flex ">
					{row.map((value, colIndex) => (
						<div key={`${rowIndex}-${colIndex}`}>
							<Square
								value={value}
								defaultValue={
									WORDFEUD_DEFAULT_BOARD[rowIndex][colIndex]
								}
							/>
						</div>
					))}
				</div>
			))}
		</div>
	);
};
