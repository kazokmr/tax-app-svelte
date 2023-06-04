<script lang="ts">
  import type { Validation } from "sveltekit-superforms";
  import type { InputSchema } from "$lib/schemas/inputSchema";
  import { inputSchema } from "$lib/schemas/inputSchema";
  import { superForm } from "sveltekit-superforms/client";

  export let data: Validation<InputSchema>;
  const { form, errors, constraints, enhance } = superForm(data, {
    validators: inputSchema,
    validationMethod: "auto",
    defaultValidator: "keep"
  });
</script>

<div class="border-2 rounded-xl w-96 h-[600px]">
  <div class="border-b-2 bg-gray-100 leading-10 text-lg text-center">
    退職金情報を入力してください
  </div>
  <div>
    <form method="post" on:submit|preventDefault use:enhance>
      <label for="yearsOfService" class="block mx-3 mt-3 mb-2 text-base font-medium text-gray-900">
        勤続年数
      </label>
      <div class="inline-flex ml-4">
        <input
          type="number"
          name="yearsOfService"
          id="yearsOfService"
          class="rounded-none rounded-l-lg border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 w-24 text-base border-gray-300 p-2.5"
          data-invalid="{$errors.yearsOfService}"
          bind:value="{$form.yearsOfService}"
          {...$constraints.yearsOfService}
        />
        <span
          class="inline-flex items-center px-2.5 text-base text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md"
        >
          年
        </span>
        <span class="text-gray-500 text-sm pt-4 pl-4">1年未満の端数は切り上げ</span>
      </div>
      {#if $errors.yearsOfService}
        <div class="text-red-500 ml-4">{$errors.yearsOfService}</div>
      {/if}
      <p class="block mx-3 mt-3 mb-2 text-base font-medium text-gray-900">退職基因</p>
      <div class="flex items-center ml-4">
        <input
          type="checkbox"
          name="isDisability"
          id="isDisability"
          class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
          bind:checked="{$form.isDisability}"
        />
        <label for="isDisability" class="ml-2 text-base font-normal text-gray-900">
          障害者となったことに直接基因して退職した
        </label>
      </div>
      <p class="block mx-3 mt-3 mb-2 text-base font-medium text-gray-900">役員等以外か役員等か</p>
      <div class="flex ml-4">
        <div class="flex items-center mr-4">
          <input
            type="radio"
            name="isOfficer"
            id="isOfficer-0"
            value="0"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            bind:group="{$form.isOfficer}"
          />
          <label for="isOfficer-0" class="ml-2 text-base font-normal text-gray-900">
            役員等以外
          </label>
        </div>
        <div class="flex items-center mr-4">
          <input
            type="radio"
            name="isOfficer"
            id="isOfficer-1"
            value="1"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            bind:group="{$form.isOfficer}"
          />
          <label for="isOfficer-1" class="ml-2 text-base font-normal text-gray-900">役員等</label>
        </div>
      </div>
      <label for="severancePay" class="block mx-3 mt-3 mb-2 text-base font-medium text-gray-900">
        退職金
      </label>
      <div class="inline-flex ml-4">
        <input
          type="number"
          name="severancePay"
          id="severancePay"
          class=" rounded-none rounded-l-lg border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 w-36 text-base border-gray-300 p-2.5"
          data-invalid="{$errors.severancePay}"
          bind:value="{$form.severancePay}"
          {...$constraints.severancePay}
        />
        <span
          class="inline-flex items-center px-2.5 text-base text-gray-900 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md"
        >
          円
        </span>
      </div>
      {#if $errors.severancePay}
        <div class="text-red-500 ml-4">{$errors.severancePay}</div>
      {/if}
      <div class="m-3">
        <button
          type="submit"
          class="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 mr-2 mb-2 ml-auto block"
        >
          所得税を計算する
        </button>
      </div>
    </form>
  </div>
</div>
