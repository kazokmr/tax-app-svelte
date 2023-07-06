<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { SuperValidated } from "sveltekit-superforms";
  import { superForm } from "sveltekit-superforms/client";
  import type { CalcStatus } from "$lib/modules/calcStatus";
  import type { InputSchema } from "$lib/schemas/inputSchema";
  import { inputSchema } from "$lib/schemas/inputSchema";

  export let data: SuperValidated<InputSchema>;
  export let calcStatus: CalcStatus;
  const dispatch = createEventDispatcher();
  const { form, errors, enhance } = superForm(data, {
    validators: inputSchema,
    validationMethod: "auto",
    defaultValidator: "keep",
    onSubmit: () => {
      dispatch("changeStatus", { calcStatus: "under-calculation" });
    },
    onResult: ({ result }) => {
      if (result.type === "success") {
        dispatch("calculate", { tax: result.data.tax });
        dispatch("changeStatus", { calcStatus: "succeeded" });
      } else if (result.type === "failure" && !result.data?.form.valid) {
        dispatch("changeStatus", { calcStatus: "before-calculation" });
      } else {
        dispatch("changeStatus", { calcStatus: "failed" });
      }
    },
    onError: () => {
      dispatch("changeStatus", { calcStatus: "failed" });
    },
  });
</script>

<div class="h-[510px] w-96 rounded-xl border-2">
  <div class="border-b-2 bg-gray-100 text-center text-lg leading-10">
    退職金情報を入力してください
  </div>
  <div>
    <form method="POST" use:enhance>
      <label for="yearsOfService" class="mx-3 mb-2 mt-3 block text-base font-medium text-gray-900">
        勤続年数
      </label>
      <div class="ml-4 inline-flex">
        <input
          type="number"
          name="yearsOfService"
          id="yearsOfService"
          class="block w-24 flex-1 rounded-none rounded-l-lg border border-gray-300 p-2.5 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          aria-required="true"
          aria-invalid="{$errors.yearsOfService ? 'true' : undefined}"
          bind:value="{$form.yearsOfService}"
        />
        <span
          class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-200 px-2.5 text-base text-gray-900"
        >
          年
        </span>
        <span class="pl-4 pt-4 text-sm text-gray-500">1年未満の端数は切り上げ</span>
      </div>
      {#if $errors.yearsOfService}
        <div class="ml-4 text-red-500">{$errors.yearsOfService}</div>
      {/if}
      <p class="mx-3 mb-2 mt-3 block text-base font-medium text-gray-900">退職基因</p>
      <div class="ml-4 flex items-center">
        <label class="ml-2 text-base font-normal text-gray-900">
          <input
            type="checkbox"
            name="isDisability"
            class="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300"
            aria-required="true"
            bind:checked="{$form.isDisability}"
          />
          障害者となったことに直接基因して退職した
        </label>
      </div>
      <p class="mx-3 mb-2 mt-3 block text-base font-medium text-gray-900">役員等以外か役員等か</p>
      <div class="ml-4 flex">
        <div class="mr-4 flex items-center">
          <label class="ml-2 text-base font-normal text-gray-900">
            <input
              type="radio"
              name="isOfficer"
              value="0"
              class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
              bind:group="{$form.isOfficer}"
            />
            役員等以外
          </label>
        </div>
        <div class="mr-4 flex items-center">
          <label class="ml-2 text-base font-normal text-gray-900">
            <input
              type="radio"
              name="isOfficer"
              value="1"
              class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
              bind:group="{$form.isOfficer}"
            />
            役員等
          </label>
        </div>
      </div>
      <label for="severancePay" class="mx-3 mb-2 mt-3 block text-base font-medium text-gray-900">
        退職金
      </label>
      <div class="ml-4 inline-flex">
        <input
          type="number"
          name="severancePay"
          id="severancePay"
          class=" block w-36 flex-1 rounded-none rounded-l-lg border border-gray-300 p-2.5 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          aria-required="true"
          aria-invalid="{$errors.severancePay ? 'true' : undefined}"
          bind:value="{$form.severancePay}"
        />
        <span
          class="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-200 px-2.5 text-base text-gray-900"
        >
          円
        </span>
      </div>
      {#if $errors.severancePay}
        <div class="ml-4 text-red-500">{$errors.severancePay}</div>
      {/if}
      <div class="m-3">
        <button
          type="submit"
          class="mb-2 ml-auto mr-2 block rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
          disabled="{calcStatus === 'under-calculation'}"
        >
          {#if calcStatus === "under-calculation"}
            <svg
              aria-hidden="true"
              role="status"
              class="mr-3 inline h-4 w-4 animate-spin text-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"></path>
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"></path>
            </svg>
          {:else}
            所得税を計算する
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>
