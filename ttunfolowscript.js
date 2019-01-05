/* Restaura o console.info */
var i = document.createElement('iframe');
i.style.display = 'none';
document.body.appendChild(i);
window.console = i.contentWindow.console;


//Funcão que dar unfollow para quem não te segue de volta e para quem não é VERIFICADO
function unfollow(){
	var unfollow_list = [];
	$("div[data-test-selector='ProfileTimelineUser']").each(function(cardIndex, card){
        var unfollow = true;
        var card = $(card);

        var cardProfileContents = $(card.find("div.ProfileCard-content"));
        if(cardProfileContents.find("span.Icon--verified").length > 0){ //Veririca se a pessoa tem selo de Verificado
           unfollow = false;
        }else if($(cardProfileContents.find("span.FollowStatus")).html() == "Follows you"){ //Verifica se a pessoa me segue
           unfollow = false;
        }
        if(unfollow){ //Se for para remover
            var profileActions = $(cardProfileContents.find("div.ProfileCard-actions"));
            var clickToUnfollow = false;

            $(profileActions.find("button.EdgeButton")).each(function(btnindex, btn){  //Para cada botão de status, preciso pegar qual está visível
               var btn = $(btn);
               if($(btn.find("span")[0]).html() == "Following" && btn.is(":visible")){ //Se for o botão de Following (eu estou seguindo a pessoa)
                 clickToUnfollow = true;
               }
            })

            if(clickToUnfollow){ //Se for para desseguir, adiciona o item (span com evento) na lista que vai rodar no timer
               unfollow_list.push(profileActions.find("span.user-actions-follow-button.js-follow-btn.follow-button"))
            }
        }
		
	})

	if(unfollow_list.length == 0){
		console.info("-- Não há contas para deixar de seguir! ---");
	}else{
		console.info("-- Deixar de seguir "+unfollow_list.length+" contas! ---");
		var forEachTimer = new ForEachTimer({
			list: unfollow_list,
			onEvent: function(item, itemIndex){
				item.click();
				console.info("-- Feito "+(itemIndex+1)+"/"+unfollow_list.length+"! ---");
			}
		});
		forEachTimer.Run();
	}
}

ForEachTimer = function(cfg){
	var public = this;
	var private = {};

	private.list = null;
	private.current_index = 0;
	private.onEvent = function(){};

	public.constructor = function(cfg){
		private.list = cfg.list;
		private.onEvent = cfg.onEvent;
		return public;
	}

	public.Run = function(){
		if(private.list.length > 0 && private.current_index < private.list.length){
			private.onEvent(private.list[private.current_index], private.current_index);
	       
	        private.current_index++;
	        var randTime = Math.floor((Math.random() * 15) + 5) * 100;
	        setTimeout(function(){
	        	public.Run()
	        }, randTime);
		}
	}

	return public.constructor(cfg);
}

unfollow();




