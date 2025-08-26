"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSummary } from "@/hooks/useSummary";
import { useOrders } from "@/hooks/useOrders";
import { Button, Card, Input, Label } from "@/components/ui";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/table";
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from "@/components/modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/form";
import { addOrderSchema, type AddOrderFormData } from "@/lib/schema";

export default function Home() {
  const {
    data: summary,
    loading: loadingSummary,
    error: summaryError,
    refresh: refreshSummary,
  } = useSummary();
  const {
    data: orders,
    loading: loadingOrders,
    error: ordersError,
    setFilter,
    setPage,
    page,
    create,
  } = useOrders({ limit: 5, offset: 0 });
  const [filter, setFilterInput] = useState<string>("");
  const [open, setOpen] = useState(false);

  const form = useForm<AddOrderFormData>({
    resolver: zodResolver(addOrderSchema),
    defaultValues: {
      product: "",
      qty: 1,
      price: 0,
    },
  });

  async function onSubmit(data: AddOrderFormData) {
    await create(data);
    form.reset();
    await refreshSummary();
    setOpen(false);
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-zinc-500">Total Revenue</div>
          <div className="text-2xl font-bold mt-1">
            {loadingSummary ? "…" : summary?.totalRevenue ?? 0}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500">Median Order Price</div>
          <div className="text-2xl font-bold mt-1">
            {loadingSummary ? "…" : summary?.medianOrderPrice ?? 0}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-zinc-500">Top Product by Qty</div>
          <div className="text-2xl font-bold mt-1">
            {loadingSummary ? "…" : summary?.topProductByQty ?? "-"}
          </div>
        </Card>
      </div>

      {(summaryError || ordersError) && (
        <div className="text-red-600 text-sm">
          {summaryError || ordersError}
        </div>
      )}

      <Card>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Label htmlFor="filter">Filter by product</Label>
            <Input
              id="filter"
              value={filter}
              onChange={(e) => setFilterInput(e.target.value)}
              placeholder="e.g. apple"
            />
          </div>
          <Button onClick={() => setFilter(filter)}>Apply</Button>
        </div>
      </Card>

      <Card>
        <div className="mb-3 font-medium">Recent Orders</div>
        {loadingOrders ? (
          <div>Loading…</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.product}</TableCell>
                  <TableCell>{o.qty}</TableCell>
                  <TableCell>${o.price}</TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-zinc-500">
                    No orders.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        <div className="flex justify-end">
          <div className="flex space-x-2 mt-3">
            <Button
              onClick={() =>
                setPage(Math.max(0, page.offset - (page.limit ?? 5)))
              }
              disabled={page.offset === 0}
            >
              Prev
            </Button>
            <Button onClick={() => setPage(page.offset + (page.limit ?? 5))}>
              Next
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>Add Order</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Add Order</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end"
          >
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-2">s
              <FormField
                control={form.control}
                name="qty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qty</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="w-full col-span-2">
              <Button type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </Dialog>
    </div>
  );
}
