<script lang="ts">
  import { onMount } from 'svelte';
  import { result, suppliers, contracts, supplierData, bidArea, price } from '../lib/store';

  //  20000 kwh
  const getData = () => {
    fetch(import.meta.env.VITE_TEST_URL)
      .then((res) => res.json())
      .then((data) => result.set(data))
      .catch((err) => console.log(err.msg));
  };

  let selected = {
    supplier: '' as string,
    bid_area: undefined,
    contract: '' as string
  };
  let supplier: any[] | undefined;
  let area;
  let contract;

  const handleSupplier = () => {
    if ($result) {
      supplier = $supplierData?.filter((data) => data.supplier === selected.supplier);
    }
  };
  const handleCurrentSupplier = () => {
    area = supplier?.filter((data) => data.bid_area == selected.bid_area);
    contract = area.map((data) => data.contract_name);

    contracts.set(contract);
  };
  const getPrice = () => {
    let prices = area.find((element) => element.price_ore_per_kwh);
    price.set(prices.price_ore_per_kwh);
  };
  onMount(async () => {
    getData();
  });
  const displaySuppliers = [...new Set($suppliers)];
</script>

<h1>Elende</h1>
<form>
  <select bind:value={selected.supplier} on:change={() => handleSupplier()}>
    <option value="" disabled selected>Välj din elleverantör</option>
    {#each displaySuppliers as option}<option value={option}>{option}</option>{/each}
  </select>

  <select bind:value={selected.bid_area} on:change={() => handleCurrentSupplier()}>
    <option value="" disabled selected>Välj ditt elområde</option>
    {#each $bidArea as area}
      <option value={area}>{area}</option>
    {/each}
  </select>

  <select bind:value={selected.contract} on:change={() => getPrice()}>
    <option value="" disabled selected>Välj ditt kontrakt</option>
    {#each $contracts as contract}
      <option value={contract}>{contract}</option>
    {/each}
  </select>
</form>

<h2>{$price ? `${$price}\n öre` : ''}</h2>
