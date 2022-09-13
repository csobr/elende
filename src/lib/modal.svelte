<script context="module">
  const modalList = [];
</script>

<script>
  import { booleanStore } from './store';

  const store = booleanStore(false);
  const { isOpen, open, close } = store;
  function keydown(e) {
    e.stopPropagation();
    if (e.key === 'Escape') {
      close();
    }
  }
  function transitionend(e) {
    const node = e.target;
    node.focus();
  }
  function modalAction(node) {
    const returnFn = [];
    // for accessibility
    if (document.body.style.overflow !== 'hidden') {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      returnFn.push(() => {
        document.body.style.overflow = original;
      });
    }
    node.addEventListener('keydown', keydown);
    node.addEventListener('transitionend', transitionend);
    node.focus();
    modalList.push(node);
    returnFn.push(() => {
      node.removeEventListener('keydown', keydown);
      node.removeEventListener('transitionend', transitionend);
      modalList.pop();
      // Optional chaining to guard against empty array.
      modalList[modalList.length - 1]?.focus();
    });
    return {
      destroy: () => returnFn.forEach((fn) => fn())
    };
  }
</script>

<slot name="trigger" {open}>
  <!-- fallback trigger to open the modal -->
</slot>
{#if $isOpen}
  <div class="modal" use:modalAction tabindex="0">
    <div class="backdrop" on:click={close} />

    <div class="content-wrapper">
      <span on:click={close}>Stäng</span>
      <h1>Priserna gäller för Augusti 2022</h1>
      <div class="content">
        <p>
          På den här sidan kan du ta del av elleverantörers priser/kWh för konsumenter med en
          årsförbrukning på 20 000 kWh och 2000 kWh.
        </p>
        <p>
          Rörliga priser är alltid föregående månadspriser. Priserna är angivna i totalt pris/kWh
          och innebär att din samtliga kostnader för förbrukad el är inkluderade, dvs; elpris,
          påslag, avgifter och moms.
        </p>
        <p>Ny data fr om 16:e varje månad</p>
      </div>
      <footer>
        <p>
          Datan är baserad på uppgifter som elbolagen själva rapporterat till
          <a href="https://www.ei.se/">Energimarknadsinspektionen</a>
        </p>
      </footer>
    </div>
  </div>
{/if}

<style>
  div.modal {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
  }
  div.modal:not(:focus-within) {
    transition: opacity 0.1ms;
    opacity: 0.99;
  }
  div.backdrop {
    background-color: #00472c8c;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  h1 {
    font-size: 2.4rem;
    margin-bottom: 1rem;
  }
  p {
    font-size: 1.8rem;
    white-space: wrap;
    line-height: 4rem;
  }

  div.content-wrapper {
    z-index: 10;
    width: 50%;
    height: auto;
    border-radius: 0.3rem;
    background-color: var(--background);
    overflow: hidden;
    padding: 2rem;
  }
  .content-wrapper span {
    display: flex;
    justify-content: flex-end;
    margin: 1rem;
  }
  @media (max-width: 800px) {
    div.content-wrapper {
      width: 100%;
    }
  }
  div.content {
    max-height: 50vh;
    overflow: auto;
  }
  h1 {
    opacity: 0.5;
  }

  footer p {
    font-weight: 700;
  }
</style>
