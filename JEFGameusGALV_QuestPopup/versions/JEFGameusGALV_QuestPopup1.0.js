//=============================================================================
// Jeferson Tomazella Plugins - Gameus + GALV quest message popup
// JEFGameusGALV_QuestPopup.js
//=============================================================================

var Imported = Imported || {};
Imported.JEFGameusGALV_QuestPopup = true;

var Jef = Jef || {};
Jef = Jef || {};
Jef.Quest = Jef.Quest || {};
Jef.Quest.version = 1.0;


//=============================================================================
 /*:
 * @plugindesc v1.0 Message popup with Gameus Quest System
 * @author Jeferson Tomazella
 *
 * @param X Position
 * @desc X value to show the popups.
 * Default value: 8
 * @default 8
 *
 * @param Y Position
 * @desc Y value to show the popups.
 * Default value: 8
 * @default 8
 *
 * @param Time Show Popup
 * @desc How many frames the popup message will last.
 * Default value: 240
 * @default 240
 *
 * @param Quest Acquired Message
 * @desc Message that will show when the player gets a new quest.
 * Default message: Quest Acquired
 * @default Quest Acquired
 *
 * @param Quest Completed Message
 * @desc Message that will show when the player completes a quest.
 * Default message: Quest Completed
 * @default Quest Completed
 *
 * @param Quest Failed Message
 * @desc Message that will show when the player fails a quest.
 * Default message: Quest Failed
 * @default Quest Failed
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * Gameus Quest System is far the best quest system I've encoutered out there,
 * but it doesn't have a proper messaging system.
 *
 * This is an alpha plugin to show messages with it's quests.
 *
 * ****IMPORTANT****
 * 
 * This plugins requires the GameusQuestSystem and the GALV_TimedMessagePopups
 * plugins in order to work.
 * This plugin must be placed below that two plugins.
 *
 * I did not make the plugins above, just made then work together.
 * The credits belongs to their respective owners.
 *
 * GameusQuestSystem: 
 * https://forums.rpgmakerweb.com/index.php?threads/gameus-quest-system.49234/
 *
 * GALV_TimedMessagePopups is part of his MV Quest Log plugin, it's inside his
 * demo plugin in the link below:
 * https://galvs-scripts.com/2016/11/11/mv-quest-log/
 *
 * A direct dowload link to the demo can be found here: 
 * http://www.mediafire.com/file/oldc3js9xdec8pf/Quest_Log_MV_v.1.2_%28DEMO%29.zip
 *
 * This plugin is just an integration of the two above plugins, commercial and
 * personal use are allowed without the need for credits, just don't distribute
 * this plugin without the proper credits.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.2:
 * - Show quest steps (TODO)
 *
 * Version 1.1:
 * - Show quest rewards (TODO)
 *
 * Version 1.0:
 * - Finished Plugin!
 */
//=============================================================================


//=============================================================================
// Parameters
//=============================================================================
Jef.Quest.Parameters = PluginManager.parameters("JEFGameusGALV_QuestPopup");

Jef.Quest.Param = Jef.Quest.Param || {};
Jef.Quest.Param.xPos = Jef.Quest.Parameters["X Position"];
Jef.Quest.Param.yPos = Jef.Quest.Parameters["Y Position"];
Jef.Quest.Param.time = Jef.Quest.Parameters["Time Show Popup"];
Jef.Quest.Param.qAcquiredMessage = Jef.Quest.Parameters["Quest Acquired Message"];
Jef.Quest.Param.qCompletedMessage = Jef.Quest.Parameters["Quest Completed Message"];
Jef.Quest.Param.qFailedMessage = Jef.Quest.Parameters["Quest Failed Message"];


//=============================================================================
// Functionality
//=============================================================================

	// Gameus changing
	Game_Party.prototype.addQuest = function(quest_id) {
		// Does party already have quest?
        if (this.quests.indexOf(quest_id) < 0) {
            // If not, give that crap to them. They don't have a choice now.
            this.quests.push(quest_id);
			
			// JEF
			Jef.Quest.popupQuest(quest_id,0);
        }
    };
	
	Game_Quest.prototype.fail = function()
	{
        this.status = "failed";
		Jef.Quest.popupQuest(this.questId,2);
    };
	
	Game_Quest.prototype.complete = function()
	{
        if ((GameusScripts["Config"]["QuestSystem"]["Auto Rewards"] || "false").toLowerCase() === "true") {
            this.giveRewards();
        }
        this.currentStep = this.maxSteps - 1;
        this.status = "completed";
		
		Jef.Quest.popupQuest(this.questId,1);
    };

	// I just got Galv popup system and adapted it with gameus quest system.
	Jef.Quest.popupQuest = function(id,status)
	{
		if (!Imported.Galv_MessageCaptions || !SceneManager._scene) return;
		if (!GameusScripts) return;
		
		var x = Number(Jef.Quest.Param.xPos || 8);
		var y = Number(Jef.Quest.Param.yPos || 8);
		
		var time = Number(Jef.Quest.Param.time || 240);
		
		switch (status) {
			case -1:
				return; // -1 is hiding an objective.
			case 0:
				var txt = Jef.Quest.Param.qAcquiredMessage || "Quest Acquired";
				break;
			case 1:
				var txt = Jef.Quest.Param.qCompletedMessage || "Quest Completed";
				break;
			case 2:
				var txt = Jef.Quest.Param.qFailedMessage || "Quest Failed";
				break;
		}
		if (txt) {
			var q = $gameQuests.get(id);
			var name = q.name;
			SceneManager._scene.createCaptionWindow([x,y],time,[txt + ": " + name],[],0);
		}
		
	};


//=============================================================================
// End of File
//=============================================================================
