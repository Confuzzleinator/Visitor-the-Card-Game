/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.visitor.set1;

import com.visitor.card.types.Ability;
import com.visitor.card.types.Asset;
import com.visitor.game.Game;
import static com.visitor.game.Game.Zone.PLAY;
import com.visitor.helpers.Hashmap;
import static com.visitor.protocol.Types.Knowledge.GREEN;


/**
 *
 * @author pseudo
 */
public class PuzzleBox extends Asset {
    
    public PuzzleBox (String owner){
        super("Puzzle Box", 1, new Hashmap(GREEN, 1), 
                "2, Activate: \n" +
                "    Study Puzzle Box.", 
                1,
                owner);
    }

    @Override
    public boolean canActivate(Game game) {
        return super.canActivate(game) &&
               game.hasEnergy(controller, 2);
    }
    
    @Override
    public void activate(Game game) {
        game.deplete(id);
        game.spendEnergy(controller, 2);
        game.addToStack(new Ability(this, 
                "Study Puzzle Box",
            (x) -> {
                if(game.isIn(controller, id, PLAY)){
                    game.studyCardIrregular(controller, id);
                }
            }));
    }
}
