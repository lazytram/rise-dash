import { BaseRenderer } from "./BaseRenderer";
import { Player } from "@/types/game";

export class PlayerRenderer extends BaseRenderer {
  drawPlayer(player: Player): void {
    this.drawPlayerShadow(player);
    this.drawPlayerBody(player);
    this.drawPlayerHead(player);
    this.drawPlayerFace(player);
    this.drawPlayerSleeves(player);
    this.drawPlayerHands(player);
  }

  private drawPlayerShadow(player: Player): void {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    this.ctx.fillRect(
      player.x + 2,
      player.y + player.height + 2,
      player.width - 4,
      4
    );
  }

  private drawPlayerBody(player: Player): void {
    // Draw player body (kimono-like shape)
    this.ctx.fillStyle = "#8B4513"; // Brown kimono color
    this.ctx.fillRect(
      player.x + 2,
      player.y + 8,
      player.width - 4,
      player.height - 8
    );

    // Draw kimono collar (white)
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(player.x + 4, player.y + 6, player.width - 8, 6);

    // Draw kimono belt (red)
    this.ctx.fillStyle = "#DC143C";
    this.ctx.fillRect(player.x + 3, player.y + 18, player.width - 6, 4);
  }

  private drawPlayerHead(player: Player): void {
    // Draw head (skin tone)
    this.ctx.fillStyle = "#FFE4B5";
    this.ctx.fillRect(player.x + 4, player.y, player.width - 8, 12);

    // Draw hair (black)
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(player.x + 2, player.y, player.width - 4, 6);
  }

  private drawPlayerFace(player: Player): void {
    // Draw eyes (white)
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(player.x + 7, player.y + 4, 4, 4);
    this.ctx.fillRect(player.x + 19, player.y + 4, 4, 4);

    // Draw pupils (black)
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(player.x + 8, player.y + 5, 2, 2);
    this.ctx.fillRect(player.x + 20, player.y + 5, 2, 2);

    // Draw mouth (simple line)
    this.ctx.strokeStyle = "#8B0000";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(player.x + 12, player.y + 10);
    this.ctx.lineTo(player.x + 18, player.y + 10);
    this.ctx.stroke();
  }

  private drawPlayerSleeves(player: Player): void {
    // Draw kimono sleeves
    this.ctx.fillStyle = "#8B4513";
    this.ctx.fillRect(player.x, player.y + 10, 4, 8);
    this.ctx.fillRect(player.x + player.width - 4, player.y + 10, 4, 8);
  }

  private drawPlayerHands(player: Player): void {
    // Draw hands
    this.ctx.fillStyle = "#FFE4B5";
    this.ctx.fillRect(player.x - 2, player.y + 12, 3, 4);
    this.ctx.fillRect(player.x + player.width - 1, player.y + 12, 3, 4);
  }
}
