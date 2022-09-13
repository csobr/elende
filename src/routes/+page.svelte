<script lang="ts">
  import '../index.css';
  import { result, suppliers, contracts, supplierData, bidArea, price, hours } from '$lib/store';
  import Modal from '$lib/modal.svelte';
  import { onMount } from 'svelte';
  let supplier: any[] | undefined;
  let area;
  let contract;

  let selected = {
    supplier: '' as string,
    bid_area: '' as string,
    contract: '' as string
  };
  let options = [
    { value: '20000', text: '20000' },
    { value: '2000', text: '2000' }
  ];
  function resetFields() {
    if (selected.contract && selected.bid_area != '') {
      selected.contract = '';
      selected.bid_area = '';
      selected.supplier = '';
      price.set('0');
    }
  }
  const getDataSource = () => {
    let dataSource;

    if ($hours === '20000') {
      dataSource = $result.hus;
    }
    if ($hours === '2000') {
      dataSource = $result.lgh;
    }
    supplierData.set(Object.values(dataSource?.filter((data) => data.supplier)));
    suppliers.set(dataSource?.map((data) => data.supplier));
  };
  const handleSupplier = () => {
    resetFields();
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
  const handleInputChange = () => {
    resetFields();

    getDataSource();
  };

  $hours = '20000';
  getDataSource();

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
    <div class="radio-buttons">
      {#each options as { value, text }, idx}
        <label for={text} class="hours">
          <input
            type="radio"
            id={idx}
            {value}
            bind:group={$hours}
            on:change={() => handleInputChange()}
          />
          <span>{text}</span></label
        >
      {/each}
    </div>
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
          <option value="" disabled selected>Välj avtal</option>
          {#each $contracts as contract}
            <option value={contract}>{contract}</option>
          {/each}
        </select>
      </div>
    </form>
  </div>
</main>
<footer>Byggd av <a target="/" href="https://sihamhadi.com">srh</a></footer>

<style>
  main {
    width: 100%;
    padding-bottom: 15rem;
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
    margin-top: 1rem;
  }
  .radio-buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 5rem;
  }
  .hours {
    width: 11rem;
    font-size: 2rem;
    font-weight: 600;
    display: grid;
    grid-template-columns: 1em auto;
    gap: 0.5em;
  }
  input[type='radio'] {
    -webkit-appearance: none;
    appearance: none;
    background-color: var(--background);
    font: inherit;
    color: currentColor;
    width: 1.15em;
    height: 1.15em;
    border: 0.15em solid currentColor;
    border-radius: 50%;
    transform: translateY(-0.075em);
    display: grid;
    place-content: center;
  }
  input[type='radio']::before {
    content: '';
    width: 0.65em;
    height: 0.65em;
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em var(--color);
  }
  input[type='radio']:checked::before {
    transform: scale(1);
  }

  .hours:focus-within {
    color: currentColor;
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
    font-size: 1.7rem;
    outline: 0;
    width: 100%;
  }
  .select {
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 100%;
    height: 6rem;
    padding: 2rem;
    margin: 0 auto;
    background: rgba(0, 71, 44, 0.05);
    border: 0;
    border-radius: 0.4rem;
    margin: 2.5rem;
    color: var(--color);
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
