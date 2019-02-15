
package com.ccg.ancientaliens.card.types;

import com.ccg.ancientaliens.card.Card;
import com.ccg.ancientaliens.card.properties.Activatable;
import enums.Knowledge;
import static enums.Phase.MAIN;
import com.ccg.ancientaliens.game.Game;
import helpers.Hashmap;

/**
 * Abstract class for the Item card type.
 * @author pseudo
 */
public abstract class Item extends Card implements Activatable {
    
    /**
     *
     * @param name
     * @param cost
     * @param knowledge
     * @param text
     * @param image
     * @param owner
     */
    public Item(String name, int cost, Hashmap<Knowledge, Integer> knowledge, String text, String image, String owner) {
        super(name, cost, knowledge, text, "assets/item.png", owner);
    }
    
    
    @Override
    public void resolve(Game game) {
        depleted = true;
        game.players.get(controller).playArea.add(this);
    }
    
    @Override
    public boolean canPlay(Game game){ 
        return (game.players.get(controller).energy >= cost)
               && game.players.get(controller).hasKnowledge(knowledge)
               && game.turnPlayer.equals(controller)
               && game.phase == MAIN;
    }  
}
