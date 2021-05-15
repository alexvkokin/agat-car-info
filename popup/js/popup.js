$(function(){
   console.log("hello")
   $('#getCarInfo').submit(function(){

      // Форма
      let form = $(this)
      // Контейнер для результатов
      let container = $('#carInfoResult')
      // Данные формы
      let data = getFormData(form);
      console.log(data);

      let link = null;
      if (typeof data.server !== 'undefined') {
         switch(data.server){
            case 'prod': link='http://group.agat.local/cars.php'; break;
            case 'dev': link='http://group.agat.local/cars.php'; break;
            case 'local': link='http://group.agat.local/cars.php'; break;
         }
      }

      let vin = null
      if (typeof data.vin !== 'undefined' && data.vin !== '') {
         vin = data.vin
      }

      form.find("input").attr("disabled", "disabled");
      container.addClass('d-none').find('.card').remove()

      if (link !== null && vin !== null) {
         $.ajax({
            type: "POST",
            url: link,
            data: data,
            dataType: 'json',
            error: function (jqXHR, exception) {
               console.log("Error", jqXHR, exception)
               form.find("input").removeAttr("disabled");
            }
         }).done(function( cars ) {

            if (cars.length > 0) {
               $.each(cars, function(i, car){
                  $('#carTemplate')
                      .clone()
                      .removeAttr('id')
                      .removeClass('d-none')
                      .find('.js-car_template-img').attr("src", car.img)
                      .parents('.card').find('.js-car_template-price').each(function(){
                         if (typeof car.priceSale !== 'undefined' && car.priceSale !== '') {
                            $(this).html(car.priceSale);
                         } else if (typeof car.price !== 'undefined' && car.price !== '') {
                            $(this).html(car.price);
                         } else {
                            $(this).html('0')
                         }
                      })
                      .parents('.card').find('.js-car_template-price_sale').each(function(){
                         if (typeof car.priceSale !== 'undefined' && car.priceSale !== '') {
                            $(this).html(car.price).removeClass("d-none")
                         } else {
                            $(this).html('').removeClass("d-none")
                         }
                      })
                      .parents('.card').find('.js-car_template-title').html(car.title)
                      .end()
                      .appendTo(container)
               })
            }

            form.find("input").removeAttr("disabled");
            container.removeClass('d-none').find('.js-info_result-count span').html(cars.length);
         });
      }
      return false;
   })
});

function getFormData($form){
   var unindexed_array = $form.serializeArray();
   var indexed_array = {};

   $.map(unindexed_array, function(n, i){
      indexed_array[n['name']] = n['value'];
   });

   return indexed_array;
}