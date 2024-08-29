<script lang="ts">
  export let description: string;
</script>

<span class="deckcard-desc-bit">
  {description.split(' ')[0].substring(0, description.split(' ')[0].length - 1)}
  <span class="pop-units">
      {description.split(' ')[0][description.split(' ')[0].length - 1]}
  </span>
  <i class="icon-male"></i>
</span>
<span class="deckcard-desc-bit">
  {description.split(' ')[2].substring(0, description.split(' ')[2].length - 1)}
  <span class="pop-units">
      {description.split(' ')[2][description.split(' ')[2].length - 1]}
  </span>
  <i class="icon-industrial-building"></i>
</span>