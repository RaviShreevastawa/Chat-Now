import { IoSearchSharp } from "react-icons/io5";
import useConversation from '../../zustand/useConversation';
import useGetConversation from '../../hooks/useGetConversations';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

function SearchInput() {
	const [search, setSearch] = useState("");
	const [filteredConversations, setFilteredConversations] = useState([]);
	const { setSelectedConversation } = useConversation();
	const { conversations } = useGetConversation();

	// Filter conversations based on search
	useEffect(() => {
		if (search.length >= 3) {
			const filtered = conversations?.filter((c) =>
				c.fullname.toLowerCase().startsWith(search.toLowerCase())
			);
			setFilteredConversations(filtered);
		} else {
			setFilteredConversations([]);
		}
	}, [search, conversations]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!search || search.length < 3) {
			return toast.error("Search term must be at least 3 characters long");
		}

		if (filteredConversations.length > 0) {
			setSelectedConversation(filteredConversations[0]);
			setSearch("");
			setFilteredConversations([]);
		} else {
			toast.error("No user found");
		}
	};

	const handleSelect = (conversation) => {
		setSelectedConversation(conversation);
		setSearch("");
		setFilteredConversations([]);
	};

	return (
		<div className="relative ml-3">
			<form onSubmit={handleSubmit} className="flex items-center gap-2">
				<input
					type="text"
					placeholder="Search"
					className="input input-bordered rounded-full bg-transparent text-white"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<button
					type="submit"
					className="btn btn-circle bg-transparent text-white"
				>
					<IoSearchSharp className="w-6 h-6 outline-none" />
				</button>
			</form>

			{search && filteredConversations.length > 0 && (
				<ul className="absolute top-12 z-10 w-full bg-gray-800 rounded-lg shadow-md max-h-48 overflow-auto">
					{filteredConversations.map((user) => (
						<li
							key={user._id}
							onClick={() => handleSelect(user)}
							className="p-2 hover:bg-gray-700 cursor-pointer text-white"
						>
							{user.fullname}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default SearchInput;
