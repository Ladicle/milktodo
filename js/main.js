(function(global){
    // milkcocoaへの接続&DataStore設定
    var milkcocoa = new MilkCocoa("YOUR APPLICATION ID"); // FIXME: 自分のIDに変更
    var todoDataStore = milkcocoa.dataStore('todos')

    // ページ読み込みイベント
    global.onload = onload;
    function onload() {
	var inputTodoBox = document.getElementById('input_todo_box');
	var addTodoBtn = document.getElementById('add_todo_btn');
	var todoList = document.getElementById('todo_list');

	// todoの内容をdiv#todoListへ描画
	function render_todo(todo) {
	    var todoColumn = document.createElement('div');
	    todoColumn.textContent = todo.content;
	    todoList.appendChild(todoColumn);
	}

	// 読み込み時にdataStoreから取得したtodoを描画する
	todoDataStore.stream().sort('desc').size(20).next(function(
	    err, todos) {
	    todos.forEach(function(todo) {
		render_todo(todo.value);
	    });
	});

	// クリック時にtodoの内容をdataStoreに保存
	addTodoBtn.addEventListener('click', function(e) {
	    todoContent = inputTodoBox.value
	    if ( !todoContent ) {
		return;
	    }

	    todoDataStore.push({
		content : todoContent
	    });
	    inputTodoBox.value = "";
	});

	// pushイベントを監視
	// イベント発生時に追加したtodoを描画
	todoDataStore.on('push', function(pushed) {
	    render_todo(pushed.value);
	});
    }
}(window))
