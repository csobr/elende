<script lang="ts">
  import { onMount } from 'svelte';

  import '../index.css';
  import { suppliers, contracts, supplierData, bidArea, price } from '$lib/store';
  import Modal from '$lib/modal.svelte';
  let supplier: any[] | undefined;
  let area;
  let contract;
  let selected = {
    supplier: '' as string,
    bid_area: '' as string,
    contract: '' as string
  };

  const handleSupplier = () => {
    if (selected.contract && selected.bid_area != '') {
      selected.contract = '';
      selected.bid_area = '';
      price.set('0');
    }

    supplier = $supplierData?.filter((data) => data.supplier === selected.supplier);
    area = supplier?.map((data) => data.bid_area);
    let displayBidArea = [...new Set(area)];
    bidArea.set(displayBidArea);
  };
  const handleCurrentSupplier = () => {
    area = supplier?.filter((data) => data.bid_area == selected.bid_area);
    contract = area.map((data) => data.contract_name);
    contracts.set(contract);
  };
  const getPrice = () => {
    let prices = area.find((element) => element.contract_name === selected.contract);
    price.set(prices.price_ore_per_kwh);
  };

  const displaySuppliers = [...new Set($suppliers)];
</script>

<main>
  <nav>
    <h1>Månadspriset</h1>
    <Modal>
      <div class="bulb" slot="trigger" let:open>
        <a href="/" on:click={open}> <img src="bulb.svg" alt="lightbulb" /></a>
      </div>
    </Modal>
  </nav>
  <div class="wrapper">
    <div class="circle">
      <span style="--ctr:#FFE33E;--i:18px;--d:2.5s;" />
      <span style="--ctr:#03a1d9;--i:13px;--d:5s;" />
      <span style="--ctr:#ecfff1;--i:15px;--d:7.5s;" />
      <span style="--ctr:#03ffa1a1;--i:20px;--d:10s;" />
      <div class="price">
        <h2>
          {$price ? `${$price}` : '0'}
        </h2>
        <p>{$price ? 'öre/kWh' : 'öre/kWh'}</p>
      </div>
    </div>
    <form>
      <div class="select">
        <select bind:value={selected.supplier} on:change={() => handleSupplier()}>
          <option value="" disabled selected>Välj elleverantör</option>
          {#each displaySuppliers as option}<option value={option}>{option}</option>{/each}
        </select>
      </div>
      <div class="select">
        <select bind:value={selected.bid_area} on:change={() => handleCurrentSupplier()}>
          <option value="" disabled selected>Välj elområde</option>
          {#each $bidArea as area}
            <option value={area}>{area}</option>
          {/each}
        </select>
      </div>
      <div class="select">
        <select bind:value={selected.contract} on:change={() => getPrice()}>
          <option value="" disabled selected>Välj kontrakt</option>
          {#each $contracts as contract}
            <option value={contract}>{contract}</option>
          {/each}
        </select>
      </div>
    </form>
  </div>
</main>
<footer>Made by <a target="/" href="https://sihamhadi.com">srh</a></footer>

<style>
  main {
    width: 100%;
    height: 100vh;
    padding: 2rem;
  }
  nav {
    display: grid;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  h1 {
    grid-column: 2/3;
    justify-content: center;
    font-size: 3.5rem;
    font-weight: 900;
    font-family: 'Palanquin Dark', sans-serif;
  }
  .bulb {
    grid-column: 3/3;
  }

  .wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 100%;
    margin-top: 2rem;
  }
  .circle {
    display: flex;
    align-items: center;
    position: relative;
    justify-content: flex-start;
    width: 25rem;
    height: 25rem;
    margin: 5rem;
  }

  .circle span {
    z-index: 0;
    position: absolute;
    width: calc(25rem + var(--i));
    height: calc(25rem + var(--i));
    background: var(--ctr);
    border-radius: 50%;
    transform-origin: calc(10rem + var(--i));
    animation: animate 5s linear infinite;
    animation-duration: calc(var(--d));
    filter: blur(3rem);
  }
  .circle span:nth-child(even) {
    animation-direction: reverse;
  }

  @keyframes animate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .price {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  h2 {
    font-weight: 900;
    font-size: 4.8rem;
  }
  p {
    font-size: 1.6rem;
    padding: 1rem;
  }
  form {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: transparent;
    border: none;
    font-size: 1.6rem;
    outline: 0;
    width: 100%;
  }
  .select {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 100%;
    height: 5rem;
    padding: 2rem;
    margin: 0 auto;
    background: rgba(0, 71, 44, 0.05);
    border: 0;
    border-radius: 0.4rem;
    margin: 3rem;
  }
  .select:after {
    content: '🔻';
    font-size: 1.6rem;
    color: transparent;
    text-shadow: 0 0 0 var(--color);
  }
  .select:focus {
    outline: 0.1rem solid var(--accent);
  }
  footer {
    text-align: center;
    padding: 1rem;
    font-size: 1.2rem;
    bottom: 0;
    position: relative;
  }
  footer a {
    text-decoration: none;
    color: var(--color);
  }
</style>
