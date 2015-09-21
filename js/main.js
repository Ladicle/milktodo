(function(global){
    LOCAL_STORAGE_KEY="MILKTODO_APP_KEY"

    // ページ読み込みイベント
    global.onload = onload;
    function onload() {
	// todoオブジェクトの取得
	var inputTodoBox = document.getElementById('input-todo-box');
	var addTodoBtn = document.getElementById('add-todo-btn');
	var todoList = document.getElementById('todo-list');

	// milkcocoaへの接続&DataStore設定
	var milkcocoa = null;
	var todoDataStore = null;
	var registAppidBtn = document.getElementById('regist-appid-btn');

	appId = localStorage.getItem(LOCAL_STORAGE_KEY);
	if ( appId ) {
	    document.getElementById('input-appid-box').value = appId;
	    registAppidBtn.click();
	}

	registAppidBtn.addEventListener('click', function(e) {
	    appIdBox = document.getElementById('input-appid-box');
	    parentAppIdBox = appIdBox.parentNode;
	    appId = appIdBox.value;
	    console.info("appId: " + appId);

	    if ( !appId ) {
		parentAppIdBox.className = parentAppIdBox.className + " has-error"
		return;
	    }

	    milkcocoa = new MilkCocoa(appId);
	    todoDataStore = milkcocoa.dataStore('todos');
	    parentAppIdBox.className = parentAppIdBox.className + " has-success"

	    // dataStoreから取得したtodoを描画する
	    todoDataStore.stream().sort('desc').size(20).next(function(
		err, todos) {
		todos.forEach(function(todo) {
		    renderTodo(todo.value);
		});
	    });

	    // LocalStorageにappidを追加
	    localStorage.setItem(LOCAL_STORAGE_KEY, appId);

	    // pushイベントを監視
	    // イベント発生時に追加したtodoを描画
	    todoDataStore.on('push', function(pushed) {
		renderTodo(pushed.value);
	    });
	});

	// todoの内容をdiv#todoListへ描画
	function renderTodo(todo) {
	    var todoColumn = document.createElement('li');
	    todoColumn.textContent = todo.content;
	    todoList.appendChild(todoColumn);
	}

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
    }
}(window))
