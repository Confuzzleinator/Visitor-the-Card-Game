/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.visitor.set1;

import com.visitor.card.types.Ability;
import com.visitor.card.types.Card;
import com.visitor.card.types.Asset;
import com.visitor.game.Game;
import static com.visitor.game.Game.Zone.HAND;
import com.visitor.helpers.Arraylist;
import com.visitor.helpers.Hashmap;
import com.visitor.helpers.Predicates;
import static com.visitor.helpers.UUIDHelper.getInList;
import static com.visitor.protocol.Types.Knowledge.YELLOW;
import java.util.UUID;


/**
 *
 * @author pseudo
 */
public class MetaphasicShieldCoil extends Asset {
    
    public MetaphasicShieldCoil (String owner){
        super("Metaphasic Shield Coil", 3, new Hashmap(YELLOW, 3), 
                "\"2, Activate: \n" +
                "  Create and draw a YI01 or YI02.\"", owner);
    }
    
    @Override
    public boolean canActivate(Game game) {
        return super.canActivate(game) && game.hasEnergy(controller, 2);
    }
    
    @Override
    public void activate(Game game) {
        game.spendEnergy(controller, 2);
        game.addToStack(new Ability(this, "Create and draw YI01 or YI02",
        (x) -> {
            Arraylist<Card> choices = new Arraylist<>();
            choices.add(new Ability(this, "Create and draw YI01",
                (x1) -> {
                    game.putTo(controller, new MetaphasicShieldMK5(controller), HAND);
            }));
            choices.add(new Ability(this, "Create and draw YI02",
                (x1) -> {
                    game.putTo(controller, new MetaphasicShieldMK7(controller), HAND);
            }));
            Arraylist<UUID> selection = game.selectFromList(controller, choices, Predicates::any, 1, false);
            getInList(choices, selection).get(0).resolve(game);
        }));
    }
}
