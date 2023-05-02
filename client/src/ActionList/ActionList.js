
export default class ActionList
{
	list;
	#currentActionIndex;
	constructor() 
	{
		this.#currentActionIndex = 0;
		this.list = [];
		document.addEventListener("keydown", (event) => {
			if (event.ctrlKey && event.key === "z") {
				this.undo();
			}
			if (event.ctrlKey && event.key === "y") {
				this.redo();
			}
		});
	}
	
	undo() 
	{
		if(this.#currentActionIndex) 
		{
			//console.log(this.list[--this.#currentActionIndex]);
			this.list[--this.#currentActionIndex].undo();
		}
	}

	redo() 
	{
		if(this.#currentActionIndex < this.list.length) 
		{
			this.list[this.#currentActionIndex++].redo();
		}
	}

	push(action) 
	{
		this.list.length = this.#currentActionIndex;
		this.list.push(action);
		this.#currentActionIndex = this.list.length;
	}
}