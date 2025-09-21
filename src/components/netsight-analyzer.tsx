
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  Download,
  Gauge,
  Loader2,
  Signal,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useMemo, useState, useTransition, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { z } from 'zod';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


import { getAiSuggestions } from '@/lib/actions';
import {
  AI_GOAL_OPTIONS,
  INITIAL_PARAMS,
  MODULATION_OPTIONS,
  NETWORK_TYPE_OPTIONS,
} from '@/lib/constants';
import {
  generateChartData,
  runSimulation,
} from '@/lib/network-calculations';
import type {
  AiGoal,
  ChartDataSet,
  SimulationMetrics,
  SimulationParameters,
} from '@/lib/types';
import { simulationParametersSchema } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const cardClassName =
'bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg transition-all duration-300';
const transparentCardClassName = 'bg-transparent border-transparent shadow-none';

export default function NetSightAnalyzer() {
  const [metrics, setMetrics] = useState<SimulationMetrics>(() => runSimulation(INITIAL_PARAMS));
  const [chartData, setChartData] = useState<ChartDataSet>(() => generateChartData(INITIAL_PARAMS));
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);


  const form = useForm<SimulationParameters>({
    resolver: zodResolver(simulationParametersSchema),
    defaultValues: INITIAL_PARAMS,
  });

  const formValues = form.watch();

  useEffect(() => {
    const subscription = form.watch(values => {
      const parsedValues = simulationParametersSchema.safeParse(values);
      if (parsedValues.success) {
        startTransition(() => {
          const newMetrics = runSimulation(parsedValues.data);
          const newChartData = generateChartData(parsedValues.data);
          setMetrics(newMetrics);
          setChartData(newChartData);
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

    const handleDownloadReport = () => {
    startTransition(async () => {
      const reportElement = reportRef.current;
      if (!reportElement) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not capture report content.',
        });
        return;
      }

      try {
        const canvas = await html2canvas(reportElement, {
          backgroundColor: null, // Use transparent background
          scale: 2,
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`netsight_report_${new Date().toISOString()}.pdf`);
        toast({
          title: 'Report Downloaded',
          description: 'Your PDF report has been successfully generated.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'PDF Generation Failed',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
      }
    });
  };


  const metricCards = useMemo(() => [
    {
      title: 'Signal Strength',
      value: `${metrics.signalStrength.toFixed(2)} dBm`,
      icon: Signal,
      description: 'Strength of the signal at the given distance.',
    },
    {
      title: 'Throughput',
      value: `${metrics.throughput.toFixed(2)} Mbps`,
      icon: TrendingUp,
      description: 'Estimated data rate.',
    },
    {
      title: 'Bit Error Rate (BER)',
      value: metrics.ber.toExponential(2),
      icon: AlertTriangle,
      description: 'Rate of data transmission errors.',
    },
    {
      title: 'SNR',
      value: `${metrics.snr.toFixed(2)} dB`,
      icon: Gauge,
      description: 'Signal-to-Noise Ratio.',
    },
  ], [metrics]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={cn(cardClassName, 'p-2 rounded-lg border text-sm')}>
          <p className="label font-bold">{`${label}`}</p>
          <p className="intro text-primary">{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" ref={reportRef}>
      <div className="lg:col-span-1 flex flex-col gap-6">
        <Card className={transparentCardClassName}>
          <CardHeader>
            <CardTitle>Parameter Configuration</CardTitle>
            <CardDescription>
              Adjust parameters to see their real-time impact.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                <FormField
                  control={form.control}
                  name="networkType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Network Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-center gap-4"
                        >
                          {NETWORK_TYPE_OPTIONS.map(type => (
                            <FormItem key={type} className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={type} id={type} />
                              </FormControl>
                              <Label htmlFor={type}>{type}</Label>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="modulation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modulation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={cardClassName}>
                            <SelectValue placeholder="Select a modulation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={cardClassName}>
                          {MODULATION_OPTIONS.map(mod => (
                            <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <SliderField control={form.control} name="bandwidth" label="Bandwidth (MHz)" min={1} max={100} step={1} />
                <SliderField control={form.control} name="distance" label="Distance (m)" min={10} max={5000} step={10} />
                <SliderField control={form.control} name="noiseLevel" label="Noise Level (dBm)" min={-120} max={-30} step={1} />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {metricCards.map(metric => (
                <Card key={metric.title} className={cardClassName}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                        <metric.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
        <Card className={cn(cardClassName, 'h-[300px] rounded-3xl')}>
          <CardHeader>
            <CardTitle className="text-lg">Signal Strength vs. Distance</CardTitle>
          </CardHeader>
          <CardContent className="h-[220px] -ml-6">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData.signalVsDistance}>
                  <defs>
                    <linearGradient id="colorSignal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(95 40% 70%)" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="hsl(95 40% 70%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                  <XAxis dataKey="x" stroke="hsl(var(--foreground))" fontSize={12} unit="m" />
                  <YAxis stroke="hsl(var(--foreground))" fontSize={12} unit="dBm" domain={[-120, -30]}/>
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="y" name="Signal" stroke="hsl(95 40% 80%)" fill="url(#colorSignal)" />
                </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={cn(cardClassName, 'h-[300px] rounded-3xl')}>
            <CardHeader><CardTitle className="text-lg">BER vs. SNR</CardTitle></CardHeader>
             <CardContent className="h-[220px] -ml-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.berVsSnr}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                  <XAxis dataKey="x" stroke="hsl(var(--foreground))" fontSize={12} unit="dB" />
                  <YAxis type="number" domain={[0, 0.5]} allowDataOverflow={true} stroke="hsl(var(--foreground))" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="y" name="BER" stroke="hsl(150 60% 80%)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className={cn(cardClassName, 'h-[300px] rounded-3xl')}>
            <CardHeader><CardTitle className="text-lg">Throughput vs. Bandwidth</CardTitle></CardHeader>
            <CardContent className="h-[220px] -ml-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.throughputVsBandwidth}>
                      <defs>
                        <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(150 60% 70%)" stopOpacity={0.7}/>
                          <stop offset="95%" stopColor="hsl(150 60% 70%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                      <XAxis dataKey="x" stroke="hsl(var(--foreground))" fontSize={12} unit="MHz" />
                      <YAxis stroke="hsl(var(--foreground))" fontSize={12} unit="Mbps" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="y" name="Throughput" stroke="hsl(150 60% 80%)" fill="url(#colorThroughput)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <div className="mt-6 flex justify-center">
        <Button variant="outline" onClick={handleDownloadReport} disabled={isPending} className="w-full max-w-xs">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download Report (PDF)
        </Button>
    </div>
  </>
  );
}

function SliderField({ control, name, label, min, max, step }: { control: any; name: keyof SimulationParameters; label: string; min: number; max: number; step: number; }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>{label}</FormLabel>
            <span className="text-sm font-medium text-primary">{field.value}</span>
          </div>
          <FormControl>
            <Slider
              value={[field.value as number]}
              onValueChange={(value) => field.onChange(value[0])}
              min={min}
              max={max}
              step={step}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

    