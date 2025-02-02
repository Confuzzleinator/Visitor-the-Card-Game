/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.visitor.card.properties;

import com.visitor.game.Game;
/**
 * Interface for cards that has an activating ability.
 * @author pseudo
 */
public interface Activatable {
    
    /**
     * BEHAVIOR: return true if asset can be activated.
     * @param game
     * @return
     */
    public boolean canActivate(Game game);
    

    /**
     * BEHAVIOR: Execute effects of the activation.
     * @param game
     */
    public void activate(Game game);
}
