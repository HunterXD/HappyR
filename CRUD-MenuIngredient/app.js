$(document).ready(function() {
        const config = {
        //AQUÍ VA TU PORPIO SDK DE FIREBASE
        apiKey: "AIzaSyBSVX95rdySKROKsu4ewJP8UH9IXO1rsak",
        authDomain: "alfa-32cf3.firebaseapp.com",
        databaseURL: "https://alfa-32cf3-default-rtdb.firebaseio.com",
        projectId: "alfa-32cf3",
        storageBucket: "alfa-32cf3.appspot.com",
        messagingSenderId: "862530248966",
        appId: "1:862530248966:web:1294741dc1a68fcbaebe87",
        measurementId: "G-KG40LJ1V23"
    };    
    firebase.initializeApp(config); //inicializamos firebase
    
    var filaEliminada; //para capturara la fila eliminada
    var filaEditada; //para capturara la fila editada o actualizada

    //creamos constantes para los iconos editar y borrar    
    const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
    const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';

    var db = firebase.database();
    var collectionMenuIngredient = db.ref().child("MenuIngredient");
         
    var dataSet = [];//array para guardar los valores de los campos inputs del form
    /*datatable*/
    var tableMenuIngredient = $('#tablaMenuIngredient').DataTable({
            pageLength : 5,
            lengthMenu: [[5, 10, 50, -1], [5, 50, 20, 'Todos']],
            data: dataSet,
            columnDefs: [
                {
                    targets: [0], 
                    visible: false, //ocultamos la columna de ID que es la [0]                        
                },
                {
                    targets: -1,        
                    defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>"+iconoEditar+"</button><button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>"+iconoBorrar+"</button></div></div>"
                }
            ]	   
        });

    collectionMenuIngredient.on("child_added", datos => {        
        /*Al insertar datos pinta la fila añadida, en lugar de realizar todas las consultas*/
        dataSet = [datos.key, datos.child("menu").val(), datos.child("ingredient").val()];
        tableMenuIngredient.rows.add([dataSet]).draw();
    });
    collectionMenuIngredient.on('child_changed', datos => {           
        /*Al actualizar datos pinta la fila editada, en lugar de realizar todas las consultas*/
        dataSet = [datos.key, datos.child("menu").val(), datos.child("ingredient").val()];
        tableMenuIngredient.row(filaEditada).data(dataSet).draw();
    });
    collectionMenuIngredient.on("child_removed", function() {
         /*Eliminar la fila eliminada, en lugar de realizar todas las consultas*/
        tableMenuIngredient.row(filaEliminada.parents('tr')).remove().draw();                     
    });
          
    $('form').submit(function(e){         
        /*obtener datos del modal*/                
        e.preventDefault();
        let id = $.trim($('#menuIngredient_id').val());        
        let menu = $.trim($('#menu_id').val());
        let ingredient = $.trim($('#ingredient_id').val());               
        /* 
            obtener id
            si existe actualiza
            si no existe, obtiene un id, y luego se inserta
        */

        let idFirebase = id; 
        if (idFirebase == ''){       
            /*obtiene un id para luego insertar*/               
            idFirebase = collectionMenuIngredient.push().key;
        };    

        /*crea un objeto que será la fila que se va a insertar o actualizar*/            
        data = {menu:menu, ingredient:ingredient};             
        actualizacionData = {};
        actualizacionData[`/${idFirebase}`] = data;
        collectionMenuIngredient.update(actualizacionData);

        /*Borra el id para proteger los datos*/
        id = '';        

        /*esconder el modal*/
        $("form").trigger("reset");
        $('#Menu_Ingredients_Modal').modal('hide');
    });

    //Botones
    $('#btnNewMenuIngredient').click(function() {

        /*resetear campos del modal */ 
        $('#menuIngredient_id').val('');   
        $('#menu_id').val('');
        $('#ingredient_id').val('');
        
        /*Mostrar el modal para insertar*/
        $("form").trigger("reset");
        $('#Menu_Ingredients_Modal').modal('show');
    });        

    $("#Menu_Ingredients_Modal").on("click", ".btnEditar", function() {    

        /*Obtener los datos de la fila de la tabla*/
        filaEditada = tableMenuIngredient.row($(this).parents('tr'));           
        let fila = $('#tablaMenuIngredient').dataTable().fnGetData($(this).closest('tr'));               
        let id = fila[0];
		let menu = $(this).closest('tr').find('td:eq(0)').text(); 
        let ingredient = $(this).closest('tr').find('td:eq(1)').text();        
        
        /*modificar los campos del modal */ 
        $('#menuIngredient_id').val(id);      
        $('#menu_id').val(menu);          
        $('#ingredient_id').val(ingredient);              

        /*mostrar el modal para actualizar*/ 
        $('#Menu_Ingredients_Modal').modal('show');
	});  
  
    $("#tablaMenuIngredient").on("click", ".btnBorrar", function() {   

        /*Alerta para confirmar*/ 
        filaEliminada = $(this);
        Swal.fire({
        title: '¿Está seguro de eliminar este ingrediente?',
        text: "¡Está operación no se puede revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Borrar'
        }).then((result) => {
        if (result.value) {
            /*borra el objeto que tiene un id igual*/
            let fila = $('#tablaMenuIngredient').dataTable().fnGetData($(this).closest('tr'));            
            let id = fila[0];            
            db.ref(`Ingredient/${id}`).remove()
            /*Alerta que se ha eliminado*/
            Swal.fire('¡Eliminado!', 'El ingrediente ha sido eliminado.','success')
        }
        })        
	});  

});